import { db } from "../db";
import { sql } from "drizzle-orm";
import { promises as fs } from "fs";
import path from "path";

export interface DatabaseStats {
  tables: TableInfo[];
  totalRows: number;
  databaseSize: string;
  connections: number;
  uptime: string;
  version: string;
}

export interface TableInfo {
  name: string;
  rowCount: number;
  size: string;
  lastModified: string;
}

export interface QueryResult {
  rows: any[];
  rowCount: number;
  executionTime: number;
  affectedRows?: number;
}

export interface BackupInfo {
  id: string;
  filename: string;
  size: string;
  created: string;
  tables: string[];
  type: 'full' | 'schema' | 'data';
}

export class DatabaseManager {
  private backupPath: string;

  constructor() {
    this.backupPath = process.env.BACKUP_STORAGE_PATH || './local_storage/backups/db';
    this.ensureBackupDirectory();
  }

  private async ensureBackupDirectory() {
    try {
      await fs.mkdir(this.backupPath, { recursive: true });
    } catch (error) {
      console.error('Failed to create backup directory:', error);
    }
  }

  async getDatabaseStats(): Promise<DatabaseStats> {
    try {
      // Get database version
      const versionResult = await db.execute(sql`SELECT version()`);
      const version = versionResult.rows[0]?.version || 'Unknown';

      // Get database size
      const sizeResult = await db.execute(sql`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size
      `);
      const databaseSize = sizeResult.rows[0]?.size || '0 bytes';

      // Get connection count
      const connectionsResult = await db.execute(sql`
        SELECT count(*) as count FROM pg_stat_activity WHERE datname = current_database()
      `);
      const connections = Number(connectionsResult.rows[0]?.count) || 0;

      // Get uptime
      const uptimeResult = await db.execute(sql`
        SELECT date_trunc('second', current_timestamp - pg_postmaster_start_time()) as uptime
      `);
      const uptime = uptimeResult.rows[0]?.uptime || '0:00:00';

      // Get table information
      const tablesResult = await db.execute(sql`
        SELECT 
          schemaname,
          tablename,
          n_tup_ins + n_tup_upd + n_tup_del as total_operations,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
          greatest(last_vacuum, last_autovacuum, last_analyze, last_autoanalyze) as last_modified
        FROM pg_stat_user_tables 
        ORDER BY total_operations DESC
      `);

      const tables: TableInfo[] = [];
      let totalRows = 0;

      for (const table of tablesResult.rows) {
        // Use parameterized query with proper escaping for table/schema names
        const countResult = await db.execute(
          sql`SELECT COUNT(*) as count FROM ${sql.identifier(table.schemaname)}.${sql.identifier(table.tablename)}`
        );
        const rowCount = Number(countResult.rows[0]?.count) || 0;
        totalRows += rowCount;

        tables.push({
          name: `${table.schemaname}.${table.tablename}`,
          rowCount,
          size: table.size || '0 bytes',
          lastModified: table.last_modified || 'Unknown'
        });
      }

      return {
        tables,
        totalRows,
        databaseSize,
        connections,
        uptime: String(uptime),
        version: version.split(' ')[0] // Just the version number
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      throw new Error('Failed to retrieve database statistics');
    }
  }

  async executeQuery(query: string): Promise<QueryResult> {
    const startTime = Date.now();
    
    try {
      // Sanitize and validate query
      const sanitizedQuery = query.trim();
      if (!sanitizedQuery) {
        throw new Error('Query cannot be empty');
      }

      // Enhanced security: Only allow safe read-only operations
      const allowedPatterns = [
        /^SELECT\s+/i,
        /^EXPLAIN\s+/i,
        /^WITH\s+.+\s+SELECT\s+/i,
      ];

      const isAllowed = allowedPatterns.some(pattern => pattern.test(sanitizedQuery));
      if (!isAllowed) {
        throw new Error('Only SELECT, EXPLAIN, and WITH...SELECT queries are allowed for security reasons');
      }

      // Additional dangerous pattern checks
      const dangerousPatterns = [
        /;\s*(DROP|DELETE|UPDATE|INSERT|ALTER|CREATE|TRUNCATE)/i,
        /UNION.*SELECT.*FROM.*information_schema/i,
        /'\s*(OR|AND).*=.*=/i, // Basic SQL injection patterns
        /--.*DROP/i,
        /\/\*.*\*\//i, // Block comments that might hide malicious code
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(sanitizedQuery)) {
          throw new Error('Query contains potentially dangerous patterns and is not allowed');
        }
      }

      const result = await db.execute(sql.raw(sanitizedQuery));
      const executionTime = Date.now() - startTime;

      return {
        rows: result.rows || [],
        rowCount: result.rows?.length || 0,
        executionTime,
        affectedRows: result.rowCount
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error('Query execution error:', error);
      throw new Error(`Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createBackup(type: 'full' | 'schema' | 'data' = 'full'): Promise<BackupInfo> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `daff_backup_${type}_${timestamp}.sql`;
      const backupFilePath = path.join(this.backupPath, filename);

      // Get list of tables
      const tablesResult = await db.execute(sql`
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
      `);
      const tables = tablesResult.rows.map(row => row.tablename as string);

      let backupContent = `-- DAFF Database Backup (${type})
-- Created: ${new Date().toISOString()}
-- Database: ${process.env.PGDATABASE}
-- Type: ${type.toUpperCase()}

`;

      if (type === 'full' || type === 'schema') {
        // Export schema
        for (const tableName of tables) {
          const schemaResult = await db.execute(sql`
            SELECT 
              'CREATE TABLE ' || quote_ident(table_name) || ' (' ||
              string_agg(column_definition, ', ') || 
              ');' as create_statement
            FROM (
              SELECT 
                table_name,
                quote_ident(column_name) || ' ' || 
                data_type ||
                CASE 
                  WHEN character_maximum_length IS NOT NULL 
                  THEN '(' || character_maximum_length || ')'
                  ELSE ''
                END ||
                CASE 
                  WHEN is_nullable = 'NO' THEN ' NOT NULL'
                  ELSE ''
                END as column_definition
              FROM information_schema.columns 
              WHERE table_name = ${tableName} AND table_schema = 'public'
              ORDER BY ordinal_position
            ) t
            GROUP BY table_name
          `);

          if (schemaResult.rows.length > 0) {
            backupContent += `\n-- Table: ${tableName}\n`;
            backupContent += schemaResult.rows[0].create_statement + '\n\n';
          }
        }
      }

      if (type === 'full' || type === 'data') {
        // Export data
        for (const tableName of tables) {
          const dataResult = await db.execute(sql`SELECT * FROM ${sql.identifier(tableName)}`);
          
          if (dataResult.rows.length > 0) {
            backupContent += `\n-- Data for table: ${tableName}\n`;
            
            // Get column names
            const columnsResult = await db.execute(sql`
              SELECT column_name 
              FROM information_schema.columns 
              WHERE table_name = ${tableName} AND table_schema = 'public'
              ORDER BY ordinal_position
            `);
            
            const columns = columnsResult.rows.map(row => row.column_name);
            
            for (const row of dataResult.rows) {
              const values = columns.map(col => {
                const value = row[col];
                if (value === null) return 'NULL';
                if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
                if (value instanceof Date) return `'${value.toISOString()}'`;
                return String(value);
              }).join(', ');
              
              backupContent += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values});\n`;
            }
            backupContent += '\n';
          }
        }
      }

      await fs.writeFile(backupFilePath, backupContent);

      // Get file size
      const stats = await fs.stat(backupFilePath);
      const size = this.formatBytes(stats.size);

      return {
        id: timestamp,
        filename,
        size,
        created: new Date().toISOString(),
        tables,
        type
      };
    } catch (error) {
      console.error('Backup creation error:', error);
      throw new Error(`Failed to create backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async listBackups(): Promise<BackupInfo[]> {
    try {
      const files = await fs.readdir(this.backupPath);
      const backups: BackupInfo[] = [];

      for (const file of files) {
        if (file.endsWith('.sql') && file.startsWith('daff_backup_')) {
          const filePath = path.join(this.backupPath, file);
          const stats = await fs.stat(filePath);
          
          // Parse filename to get backup info
          const parts = file.replace('.sql', '').split('_');
          const type = parts[2] as 'full' | 'schema' | 'data';
          const timestamp = parts.slice(3).join('_');

          // Read backup file to get table list
          const content = await fs.readFile(filePath, 'utf8');
          const tables = this.extractTablesFromBackup(content);

          backups.push({
            id: timestamp,
            filename: file,
            size: this.formatBytes(stats.size),
            created: stats.birthtime.toISOString(),
            tables,
            type
          });
        }
      }

      return backups.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    } catch (error) {
      console.error('Error listing backups:', error);
      return [];
    }
  }

  async restoreBackup(backupId: string): Promise<void> {
    try {
      const backups = await this.listBackups();
      const backup = backups.find(b => b.id === backupId);
      
      if (!backup) {
        throw new Error('Backup not found');
      }

      const backupFilePath = path.join(this.backupPath, backup.filename);
      const backupContent = await fs.readFile(backupFilePath, 'utf8');

      // Enhanced security validation for backup content
      const dangerousPatterns = [
        /DROP\s+DATABASE/i,
        /DROP\s+SCHEMA/i,
        /ALTER\s+SYSTEM/i,
        /COPY.*FROM.*PROGRAM/i,
        /\$\$.*\$\$/s, // Dollar-quoted strings that might contain malicious code
        /DO\s+\$\$/i, // Anonymous code blocks
        /CREATE.*FUNCTION.*LANGUAGE.*plpgsql/i, // Custom functions
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(backupContent)) {
          throw new Error('Backup contains potentially dangerous operations and cannot be restored');
        }
      }

      // Split content into individual statements
      const statements = backupContent
        .split('\n')
        .filter(line => line.trim() && !line.startsWith('--'))
        .join(' ')
        .split(';')
        .filter(stmt => stmt.trim());

      // Validate each statement before execution
      for (const statement of statements) {
        const trimmedStatement = statement.trim();
        if (trimmedStatement) {
          // Only allow safe restore operations
          const allowedRestorePatterns = [
            /^CREATE\s+TABLE/i,
            /^INSERT\s+INTO/i,
            /^COMMENT\s+ON/i,
          ];

          const isAllowed = allowedRestorePatterns.some(pattern => pattern.test(trimmedStatement));
          if (!isAllowed) {
            console.warn(`Skipping potentially unsafe statement: ${trimmedStatement.substring(0, 100)}...`);
            continue;
          }

          await db.execute(sql.raw(trimmedStatement));
        }
      }
    } catch (error) {
      console.error('Restore error:', error);
      throw new Error(`Failed to restore backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteBackup(backupId: string): Promise<void> {
    try {
      const backups = await this.listBackups();
      const backup = backups.find(b => b.id === backupId);
      
      if (!backup) {
        throw new Error('Backup not found');
      }

      const backupFilePath = path.join(this.backupPath, backup.filename);
      await fs.unlink(backupFilePath);
    } catch (error) {
      console.error('Delete backup error:', error);
      throw new Error(`Failed to delete backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async optimizeDatabase(): Promise<{ message: string; details: any[] }> {
    try {
      const optimizations = [];

      // VACUUM ANALYZE all tables
      const tablesResult = await db.execute(sql`
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
      `);

      for (const table of tablesResult.rows) {
        await db.execute(sql`VACUUM ANALYZE ${sql.identifier(table.tablename)}`);
        optimizations.push(`Optimized table: ${table.tablename}`);
      }

      // Update statistics
      await db.execute(sql`ANALYZE`);
      optimizations.push('Updated database statistics');

      // Check for unused indexes
      const unusedIndexes = await db.execute(sql`
        SELECT 
          indexrelname as index_name,
          relname as table_name,
          idx_scan,
          idx_tup_read,
          idx_tup_fetch
        FROM pg_stat_user_indexes 
        WHERE idx_scan = 0 AND schemaname = 'public'
      `);

      if (unusedIndexes.rows.length > 0) {
        optimizations.push(`Found ${unusedIndexes.rows.length} potentially unused indexes`);
      }

      return {
        message: 'Database optimization completed',
        details: optimizations
      };
    } catch (error) {
      console.error('Optimization error:', error);
      throw new Error(`Failed to optimize database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private extractTablesFromBackup(content: string): string[] {
    const tables = new Set<string>();
    const lines = content.split('\n');
    
    for (const line of lines) {
      // Look for CREATE TABLE statements
      const createTableMatch = line.match(/CREATE TABLE\s+(\w+)/i);
      if (createTableMatch) {
        tables.add(createTableMatch[1]);
      }
      
      // Look for INSERT INTO statements
      const insertMatch = line.match(/INSERT INTO\s+(\w+)/i);
      if (insertMatch) {
        tables.add(insertMatch[1]);
      }
    }
    
    return Array.from(tables);
  }

  private formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}

export const databaseManager = new DatabaseManager();