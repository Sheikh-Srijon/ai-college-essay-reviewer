"use client";

import React, { useState, useEffect } from "react";
import type { MetaEssayFeedback } from "@/types/essay";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  essayId: string;
};

// Mock API function
async function fetchMockMetaEssayFeedback(): Promise<MetaEssayFeedback> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));

  // Import the mock data
  const { mockMetaEssayFeedback } = await import("@/public/mockMetaEssayFeedback");
  return mockMetaEssayFeedback;
}

export function MetaEssayFeedbackClient({ essayId }: Props) {
  const [feedback, setFeedback] = useState<MetaEssayFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const data = await fetchMockMetaEssayFeedback();
        setFeedback(data);
      } catch (err) {
        setError("Failed to fetch feedback data");
        console.error("Error fetching feedback:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [essayId]);

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="text-lg text-gray-600">Loading essay feedback...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="flex justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="text-lg text-red-600">Error: {error || "Failed to load feedback"}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-t-lg p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <h2 className="text-xl font-bold text-gray-900">Essay Feedback & Analysis</h2>
            <div className="flex items-center gap-4">
              <Badge className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                AI Analysis
              </Badge>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="bg-white border border-gray-200 rounded-b-lg shadow-lg">
            <div className="p-8">
              {/* Elevator Pitch */}
              <Card className="mb-6 border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    Elevator Pitch
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{feedback.elevatorPitch}</p>
                </CardContent>
              </Card>

              {/* Strengths and Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Strengths */}
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feedback.strengthsAndWeaknesses.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Weaknesses */}
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                      Areas to Improve
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feedback.strengthsAndWeaknesses.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-orange-500 mt-1">⚠</span>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Structure Analysis */}
              <Card className="mb-6 border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                    Paragraph-by-Paragraph Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {feedback.structure.map((paragraphComment, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-md border-l-2 border-l-purple-300">
                        <div className="flex items-start gap-3">
                          <Badge className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 flex-shrink-0">
                            P{index + 1}
                          </Badge>
                          <p className="text-sm text-gray-700 leading-relaxed">{paragraphComment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Theme and Strategy */}
              <Card className="border-l-4 border-l-indigo-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                    Theme & Strategy Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Main Theme</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{feedback.themeStrategy.mainTheme}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Narrative Strategy</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{feedback.themeStrategy.strategy}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Effectiveness</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{feedback.themeStrategy.effectiveness}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 