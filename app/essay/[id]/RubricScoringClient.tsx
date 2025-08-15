"use client";

import React, { useState, useEffect } from "react";
import type { Rubric, RubricCriterion } from "@/types/essay";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  essayId: string;
};

// Mock API function
async function fetchMockEssayRubric(): Promise<Rubric> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Import the mock data
  const { mockEssayRubricScore } = await import("@/public/mockEssayRubricScore");
  return mockEssayRubricScore;
}
//essay ID is not important. The entire feedback will be stored in the database under one JSON.
export function RubricScoringClient({ essayId }: Props) {
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRubric = async () => {
      try {
        setLoading(true);
        const data = await fetchMockEssayRubric();
        setRubric(data);
      } catch (err) {
        setError("Failed to fetch rubric data");
        console.error("Error fetching rubric:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRubric();
  }, [essayId]);

  const getScoreColor = (score: number) => {
    if (score >= 5) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 4) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 3) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getBandColor = (band: string) => {
    switch (band) {
      case "Exceptional":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Strong":
        return "bg-green-100 text-green-800 border-green-200";
      case "Solid":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Needs Work":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="text-lg text-gray-600">Loading rubric assessment...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !rubric) {
    return (
      <div className="flex justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="text-lg text-red-600">Error: {error || "Failed to load rubric"}</div>
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Essay Rubric Assessment</h2>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{rubric.total_score}/30</div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
              <Badge className={`px-3 py-1 text-sm font-medium border ${getBandColor(rubric.band)}`}>
                {rubric.band}
              </Badge>
            </div>
          </div>
        </div>

        {/* A4 Paper-like Container */}
        <div className="bg-white border border-gray-200 rounded-b-lg shadow-lg">
          <div className="p-8" style={{
            minHeight: '297mm', // A4 height
            maxWidth: '210mm',  // A4 width
            margin: '0 auto',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            {/* Rubric Criteria */}
            <div className="space-y-6">
              {rubric.criteria.map((criterion) => (
                <Card key={criterion.id} className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                          {criterion.title}
                        </CardTitle>
                        <div className="flex items-center gap-3">
                          <Badge className={`px-3 py-1 font-medium ${getScoreColor(criterion.score)}`}>
                            Score: {criterion.score}/5
                          </Badge>
                          {criterion.score >= 4 && (
                            <span className="text-sm text-green-600 font-medium">✓ Strong</span>
                          )}
                          {criterion.score === 3 && (
                            <span className="text-sm text-yellow-600 font-medium">⚠ Solid</span>
                          )}
                          {criterion.score <= 2 && (
                            <span className="text-sm text-red-600 font-medium">⚠ Needs Improvement</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Strengths */}
                    <div>
                      <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {criterion.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Areas to Improve */}
                    {criterion.areas_to_improve && criterion.areas_to_improve.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Areas to Improve
                        </h4>
                        <ul className="space-y-1">
                          {criterion.areas_to_improve.map((area, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-orange-500 mt-1">•</span>
                              {area}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Why This Score */}
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Why This Score</h4>
                      <p className="text-sm text-gray-600">{criterion.why_score}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Overall Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{rubric.total_score}</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round((rubric.total_score / 30) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Percentage</div>
                </div>
                <div className="text-center">
                  <Badge className={`px-4 py-2 text-base font-medium ${getBandColor(rubric.band)}`}>
                    {rubric.band}
                  </Badge>
                  <div className="text-sm text-gray-600 mt-1">Performance Band</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 