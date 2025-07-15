import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardNew from "./DashboardNew";
import DashboardTabbed from "./DashboardTabbed";
import DashboardColumns from "./DashboardColumns";

export default function DashboardSelector() {
  const [selectedLayout, setSelectedLayout] = useState<'separated' | 'tabbed' | 'columns'>('separated');

  const layouts = [
    {
      id: 'separated' as const,
      name: 'Separated Layout',
      description: 'Introduction section at top, dashboard below',
      preview: '🔝 Intro → 📊 Dashboard',
      features: ['Visual hierarchy', 'Scrollable design', 'Modern gradients']
    },
    {
      id: 'tabbed' as const,
      name: 'Tabbed Interface',
      description: 'Switch between introduction and dashboard',
      preview: '📋 Tab 1 ↔ 📋 Tab 2',
      features: ['Easy navigation', 'Focused content', 'User control']
    },
    {
      id: 'columns' as const,
      name: 'Two-Column Layout',
      description: 'Side-by-side introduction and dashboard',
      preview: '📄 Intro | 📊 Dashboard',
      features: ['Efficient use of space', 'Sticky introduction', 'Responsive design']
    }
  ];

  if (selectedLayout === 'separated') {
    return <DashboardNew />;
  } else if (selectedLayout === 'tabbed') {
    return <DashboardTabbed />;
  } else if (selectedLayout === 'columns') {
    return <DashboardColumns />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            DAFF Dashboard Layouts
          </h1>
          <p className="text-xl text-gray-400">
            Choose your preferred layout design for optimal user experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {layouts.map((layout) => (
            <Card key={layout.id} className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center justify-between">
                  {layout.name}
                  {selectedLayout === layout.id && (
                    <Badge className="bg-blue-500">Active</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-4">{layout.preview}</div>
                  <p className="text-gray-300 text-sm">{layout.description}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-300">Features:</h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    {layout.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => setSelectedLayout(layout.id)}
                  className={`w-full ${
                    selectedLayout === layout.id
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {selectedLayout === layout.id ? 'Currently Active' : 'Select Layout'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-gray-800 border-gray-700 inline-block">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Layout Design Principles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-medium text-blue-300 mb-1">Visual Hierarchy</h4>
                  <p className="text-gray-400">Clear separation between introduction and functionality</p>
                </div>
                <div>
                  <h4 className="font-medium text-green-300 mb-1">User Experience</h4>
                  <p className="text-gray-400">Intuitive navigation and consistent design patterns</p>
                </div>
                <div>
                  <h4 className="font-medium text-purple-300 mb-1">Accessibility</h4>
                  <p className="text-gray-400">High contrast, proper focus states, screen reader support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}