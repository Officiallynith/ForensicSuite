import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Save, 
  Download, 
  Upload, 
  RefreshCw, 
  BookOpen, 
  Target, 
  Search, 
  BarChart3,
  Lightbulb,
  Users,
  Calendar,
  CheckCircle
} from "lucide-react";

interface ResearchProject {
  title: string;
  field: string;
  department: string;
  studentName: string;
  institution: string;
  university: string;
  location: string;
  state: string;
  guide: string;
  guidePosition: string;
  background: string;
  expertise: string;
  targetAudience: string;
  timeframe: string;
  introduction: string;
  objectives: string[];
  researchQuestions: string[];
  relevance: string;
  methodology: string;
  expectedOutcomes: string;
  impact: string;
  practicalApplications: string;
  literatureReview: string;
  budget: string;
  timeline: string;
}

export default function ResearchJustification() {
  const [project, setProject] = useState<ResearchProject>({
    title: "DAFF Framework",
    field: "Digital Forensics",
    department: "Computer Science and Engineering",
    studentName: "Nithin H K",
    institution: "JSS Mahavidyapeetha",
    university: "JSS Science & Technology",
    location: "Mysuru – 570 006",
    state: "Karnataka, India",
    guide: "Shwetha S",
    guidePosition: "Assistant Professor",
    background: "",
    expertise: "",
    targetAudience: "",
    timeframe: "5",
    introduction: "",
    objectives: [""],
    researchQuestions: [""],
    relevance: "",
    methodology: "",
    expectedOutcomes: "",
    impact: "",
    practicalApplications: "",
    literatureReview: "",
    budget: "",
    timeline: ""
  });

  const [activeSection, setActiveSection] = useState("overview");
  const [wordCount, setWordCount] = useState(0);

  const updateProject = (field: keyof ResearchProject, value: any) => {
    setProject(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addObjective = () => {
    setProject(prev => ({
      ...prev,
      objectives: [...prev.objectives, ""]
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setProject(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const removeObjective = (index: number) => {
    setProject(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const addResearchQuestion = () => {
    setProject(prev => ({
      ...prev,
      researchQuestions: [...prev.researchQuestions, ""]
    }));
  };

  const updateResearchQuestion = (index: number, value: string) => {
    setProject(prev => ({
      ...prev,
      researchQuestions: prev.researchQuestions.map((q, i) => i === index ? value : q)
    }));
  };

  const removeResearchQuestion = (index: number) => {
    setProject(prev => ({
      ...prev,
      researchQuestions: prev.researchQuestions.filter((_, i) => i !== index)
    }));
  };

  const calculateWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getTotalWordCount = () => {
    const fields = [
      project.introduction,
      project.relevance,
      project.methodology,
      project.expectedOutcomes,
      project.impact,
      project.practicalApplications,
      project.literatureReview
    ];
    return fields.reduce((total, field) => total + calculateWordCount(field), 0);
  };

  const generateDocument = () => {
    const sections = [
      {
        title: "1. Introduction to the Research Topic",
        content: project.introduction,
        wordRange: "150-200 words"
      },
      {
        title: "2. Research Objectives and Questions",
        content: `
**Objectives:**
${project.objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

**Research Questions:**
${project.researchQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
        `
      },
      {
        title: "3. Relevance to Current Academic Discourse and Gaps Addressed",
        content: project.relevance
      },
      {
        title: "4. Methodological Approach and Expected Outcomes",
        content: `
**Methodology:**
${project.methodology}

**Expected Outcomes:**
${project.expectedOutcomes}
        `
      },
      {
        title: "5. Potential Impact on the Field and Practical Applications",
        content: `
**Field Impact:**
${project.impact}

**Practical Applications:**
${project.practicalApplications}
        `
      }
    ];

    return sections;
  };

  const exportDocument = () => {
    const document = generateDocument();
    const fullDocument = `
# Academic Research Project Justification

## Student Information
**Name:** ${project.studentName}
**Department:** ${project.department}
**Project:** ${project.title}
**Focus:** ${project.field}

## Institution Details
**Institution:** ${project.institution}
**University:** ${project.university}
**Location:** ${project.location}
**State:** ${project.state}

## Supervision & Guidance
**Guide:** ${project.guide}
**Position:** ${project.guidePosition}
**Department:** ${project.department}

## Research Configuration
**Research Period:** Last ${project.timeframe} years
**Target Audience:** ${project.targetAudience}

${document.map(section => `
## ${section.title}

${section.content}
`).join('\n')}

---
**Budget Considerations:**
${project.budget}

**Timeline:**
${project.timeline}

**Literature Review Focus:**
${project.literatureReview}
    `;

    const blob = new Blob([fullDocument], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/[^a-z0-9]/gi, '_')}_justification.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sections = [
    { id: "overview", label: "Project Overview", icon: FileText },
    { id: "introduction", label: "Introduction", icon: BookOpen },
    { id: "objectives", label: "Objectives & Questions", icon: Target },
    { id: "relevance", label: "Academic Relevance", icon: Search },
    { id: "methodology", label: "Methodology", icon: BarChart3 },
    { id: "impact", label: "Impact & Applications", icon: Lightbulb },
    { id: "supporting", label: "Supporting Information", icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Academic Research Justification Editor
              </h1>
              <p className="text-slate-300">
                Create comprehensive research project justifications with evidence-based arguments
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportDocument} className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Export Document
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Total Words: {getTotalWordCount()}
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Last saved: Never
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Auto-save enabled
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Navigation Sidebar */}
          <div className="col-span-3">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Document Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map(section => {
                  const Icon = section.icon;
                  return (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeSection === section.id 
                          ? "bg-blue-600 text-white" 
                          : "text-slate-300 hover:bg-slate-700"
                      }`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {section.label}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9">
            <Card className="bg-slate-800/50 border-slate-700 min-h-[600px]">
              <CardContent className="p-6">
                {activeSection === "overview" && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-white">Academic Research Project</h2>
                    
                    {/* Student Information Section */}
                    <div className="bg-slate-700/30 p-6 rounded-lg border border-slate-600">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Student Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="studentName" className="text-slate-300">Name</Label>
                          <Input
                            id="studentName"
                            value={project.studentName}
                            onChange={(e) => updateProject("studentName", e.target.value)}
                            placeholder="Enter student name"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="department" className="text-slate-300">Department</Label>
                          <Input
                            id="department"
                            value={project.department}
                            onChange={(e) => updateProject("department", e.target.value)}
                            placeholder="e.g., Computer Science and Engineering"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label htmlFor="title" className="text-slate-300">Project</Label>
                          <Input
                            id="title"
                            value={project.title}
                            onChange={(e) => updateProject("title", e.target.value)}
                            placeholder="Enter project title"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="field" className="text-slate-300">Focus</Label>
                          <Input
                            id="field"
                            value={project.field}
                            onChange={(e) => updateProject("field", e.target.value)}
                            placeholder="e.g., Digital Forensics"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Institution Details Section */}
                    <div className="bg-slate-700/30 p-6 rounded-lg border border-slate-600">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Institution Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="institution" className="text-slate-300">Institution</Label>
                          <Input
                            id="institution"
                            value={project.institution}
                            onChange={(e) => updateProject("institution", e.target.value)}
                            placeholder="Enter institution name"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="university" className="text-slate-300">University</Label>
                          <Input
                            id="university"
                            value={project.university}
                            onChange={(e) => updateProject("university", e.target.value)}
                            placeholder="Enter university name"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label htmlFor="location" className="text-slate-300">Location</Label>
                          <Input
                            id="location"
                            value={project.location}
                            onChange={(e) => updateProject("location", e.target.value)}
                            placeholder="e.g., Mysuru – 570 006"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state" className="text-slate-300">State</Label>
                          <Input
                            id="state"
                            value={project.state}
                            onChange={(e) => updateProject("state", e.target.value)}
                            placeholder="e.g., Karnataka, India"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Supervision & Guidance Section */}
                    <div className="bg-slate-700/30 p-6 rounded-lg border border-slate-600">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2" />
                        Supervision & Guidance
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="guide" className="text-slate-300">Guide</Label>
                          <Input
                            id="guide"
                            value={project.guide}
                            onChange={(e) => updateProject("guide", e.target.value)}
                            placeholder="Enter guide name"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="guidePosition" className="text-slate-300">Position</Label>
                          <Input
                            id="guidePosition"
                            value={project.guidePosition}
                            onChange={(e) => updateProject("guidePosition", e.target.value)}
                            placeholder="e.g., Assistant Professor"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 mt-4">
                        <div>
                          <Label htmlFor="guideDepartment" className="text-slate-300">Department</Label>
                          <Input
                            id="guideDepartment"
                            value={project.department}
                            onChange={(e) => updateProject("department", e.target.value)}
                            placeholder="e.g., Computer Science and Engineering"
                            className="bg-slate-700 border-slate-600 text-white"
                            disabled
                          />
                        </div>
                      </div>
                    </div>

                    {/* Research Configuration Section */}
                    <div className="bg-slate-700/30 p-6 rounded-lg border border-slate-600">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Research Configuration
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="background" className="text-slate-300">Academic Background</Label>
                          <Input
                            id="background"
                            value={project.background}
                            onChange={(e) => updateProject("background", e.target.value)}
                            placeholder="Your academic/professional background"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="expertise" className="text-slate-300">Area of Expertise</Label>
                          <Input
                            id="expertise"
                            value={project.expertise}
                            onChange={(e) => updateProject("expertise", e.target.value)}
                            placeholder="Your area of expertise"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label htmlFor="audience" className="text-slate-300">Target Audience</Label>
                          <Input
                            id="audience"
                            value={project.targetAudience}
                            onChange={(e) => updateProject("targetAudience", e.target.value)}
                            placeholder="e.g., University Grant Committee, NSF"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="timeframe" className="text-slate-300">Literature Timeframe (years)</Label>
                          <Input
                            id="timeframe"
                            value={project.timeframe}
                            onChange={(e) => updateProject("timeframe", e.target.value)}
                            placeholder="5"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "introduction" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">Introduction to the Research Topic</h2>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {calculateWordCount(project.introduction)} words (Target: 150-200)
                      </Badge>
                    </div>
                    
                    <div>
                      <Label htmlFor="introduction" className="text-slate-300 text-sm">
                        Provide a comprehensive introduction to your research topic, including context, current state of the field, and why this research is needed.
                      </Label>
                      <Textarea
                        id="introduction"
                        value={project.introduction}
                        onChange={(e) => updateProject("introduction", e.target.value)}
                        placeholder="Enter a comprehensive introduction to your research topic..."
                        className="bg-slate-700 border-slate-600 text-white min-h-[300px] mt-2"
                      />
                    </div>

                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <h3 className="text-white font-medium mb-2">Writing Guidelines:</h3>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• Start with broad context and narrow to your specific topic</li>
                        <li>• Identify current gaps or limitations in the field</li>
                        <li>• Establish the significance of addressing these gaps</li>
                        <li>• Use recent literature to support your claims</li>
                        <li>• Keep within 150-200 words for funding applications</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeSection === "objectives" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Research Objectives and Questions</h2>
                    
                    {/* Objectives Section */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-slate-300 text-lg">Research Objectives</Label>
                        <Button onClick={addObjective} size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Add Objective
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {project.objectives.map((objective, index) => (
                          <div key={index} className="flex gap-2">
                            <div className="flex items-center text-slate-400 font-medium min-w-[30px]">
                              {index + 1}.
                            </div>
                            <Input
                              value={objective}
                              onChange={(e) => updateObjective(index, e.target.value)}
                              placeholder="Enter research objective..."
                              className="bg-slate-700 border-slate-600 text-white flex-1"
                            />
                            {project.objectives.length > 1 && (
                              <Button 
                                onClick={() => removeObjective(index)} 
                                variant="outline" 
                                size="sm"
                                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-slate-600" />

                    {/* Research Questions Section */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-slate-300 text-lg">Research Questions</Label>
                        <Button onClick={addResearchQuestion} size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Add Question
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {project.researchQuestions.map((question, index) => (
                          <div key={index} className="flex gap-2">
                            <div className="flex items-center text-slate-400 font-medium min-w-[30px]">
                              {index + 1}.
                            </div>
                            <Input
                              value={question}
                              onChange={(e) => updateResearchQuestion(index, e.target.value)}
                              placeholder="Enter research question..."
                              className="bg-slate-700 border-slate-600 text-white flex-1"
                            />
                            {project.researchQuestions.length > 1 && (
                              <Button 
                                onClick={() => removeResearchQuestion(index)} 
                                variant="outline" 
                                size="sm"
                                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <h3 className="text-white font-medium mb-2">Best Practices:</h3>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• Objectives should be SMART (Specific, Measurable, Achievable, Relevant, Time-bound)</li>
                        <li>• Research questions should be focused and answerable within your timeframe</li>
                        <li>• Each objective should align with one or more research questions</li>
                        <li>• Consider the feasibility of each objective given your resources</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeSection === "relevance" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Academic Relevance and Gaps</h2>
                    
                    <div>
                      <Label htmlFor="relevance" className="text-slate-300">
                        Describe the relevance to current academic discourse and specific gaps your research addresses
                      </Label>
                      <Textarea
                        id="relevance"
                        value={project.relevance}
                        onChange={(e) => updateProject("relevance", e.target.value)}
                        placeholder="Explain how your research fits into current academic discussions and what gaps it addresses..."
                        className="bg-slate-700 border-slate-600 text-white min-h-[300px] mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="literature" className="text-slate-300">
                        Literature Review and Citations
                      </Label>
                      <Textarea
                        id="literature"
                        value={project.literatureReview}
                        onChange={(e) => updateProject("literatureReview", e.target.value)}
                        placeholder="Provide key literature references and how they support your research justification..."
                        className="bg-slate-700 border-slate-600 text-white min-h-[200px] mt-2"
                      />
                    </div>
                  </div>
                )}

                {activeSection === "methodology" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Methodology and Expected Outcomes</h2>
                    
                    <div>
                      <Label htmlFor="methodology" className="text-slate-300">
                        Methodological Approach
                      </Label>
                      <Textarea
                        id="methodology"
                        value={project.methodology}
                        onChange={(e) => updateProject("methodology", e.target.value)}
                        placeholder="Describe your research methodology, data collection methods, analysis techniques..."
                        className="bg-slate-700 border-slate-600 text-white min-h-[250px] mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="outcomes" className="text-slate-300">
                        Expected Outcomes and Deliverables
                      </Label>
                      <Textarea
                        id="outcomes"
                        value={project.expectedOutcomes}
                        onChange={(e) => updateProject("expectedOutcomes", e.target.value)}
                        placeholder="What are the expected outcomes, deliverables, and contributions to knowledge..."
                        className="bg-slate-700 border-slate-600 text-white min-h-[200px] mt-2"
                      />
                    </div>
                  </div>
                )}

                {activeSection === "impact" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Impact and Applications</h2>
                    
                    <div>
                      <Label htmlFor="impact" className="text-slate-300">
                        Potential Impact on the Field
                      </Label>
                      <Textarea
                        id="impact"
                        value={project.impact}
                        onChange={(e) => updateProject("impact", e.target.value)}
                        placeholder="How will this research impact the field, advance knowledge, or influence future research..."
                        className="bg-slate-700 border-slate-600 text-white min-h-[250px] mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="applications" className="text-slate-300">
                        Practical Applications and Benefits
                      </Label>
                      <Textarea
                        id="applications"
                        value={project.practicalApplications}
                        onChange={(e) => updateProject("practicalApplications", e.target.value)}
                        placeholder="What are the practical applications, societal benefits, or commercial potential..."
                        className="bg-slate-700 border-slate-600 text-white min-h-[200px] mt-2"
                      />
                    </div>
                  </div>
                )}

                {activeSection === "supporting" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Supporting Information</h2>
                    
                    <div>
                      <Label htmlFor="budget" className="text-slate-300">
                        Budget Considerations
                      </Label>
                      <Textarea
                        id="budget"
                        value={project.budget}
                        onChange={(e) => updateProject("budget", e.target.value)}
                        placeholder="Outline budget requirements, resources needed, cost justification..."
                        className="bg-slate-700 border-slate-600 text-white min-h-[150px] mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="timeline" className="text-slate-300">
                        Project Timeline
                      </Label>
                      <Textarea
                        id="timeline"
                        value={project.timeline}
                        onChange={(e) => updateProject("timeline", e.target.value)}
                        placeholder="Provide a detailed timeline with milestones and key deliverables..."
                        className="bg-slate-700 border-slate-600 text-white min-h-[150px] mt-2"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Document Preview */}
        <Card className="mt-6 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Document Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 w-full rounded-md border border-slate-600 p-4 bg-slate-900/50">
              <div className="text-slate-300 space-y-4 font-mono text-sm">
                {generateDocument().map((section, index) => (
                  <div key={index}>
                    <h3 className="text-white font-bold text-base mb-2">{section.title}</h3>
                    <div className="whitespace-pre-wrap pl-4 border-l-2 border-blue-500">
                      {section.content || <span className="text-slate-500 italic">No content yet...</span>}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}