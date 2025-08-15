"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

// Essay interface
interface Essay {
  id: string;
  title: string;
  school: string;
  type: string;
}

// Mock API function
async function mock_get_essays(): Promise<Essay[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return [
    {
      id: "adv-001",
      title: "Personal Statement",
      school: "Stanford University",
      type: "Personal Statement"
    },
    {
      id: "adv-002",
      title: "Why This Major Essay",
      school: "MIT",
      type: "Supplemental"
    },
    {
      id: "adv-003",
      title: "Community Service Reflection",
      school: "Harvard University",
      type: "Activity Essay"
    },
    {
      id: "adv-004",
      title: "Leadership Experience",
      school: "UC Berkeley",
      type: "Leadership Essay"
    },
    {
      id: "adv-005",
      title: "Research Interest Statement",
      school: "Caltech",
      type: "Research Essay"
    }
  ];
}

export default function EssaysPage() {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEssays = async () => {
      try {
        setLoading(true);
        const data = await mock_get_essays();
        setEssays(data);
      } catch (err) {
        setError("Failed to fetch essays");
        console.error("Error fetching essays:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEssays();
  }, []);

  const handleCardClick = (essayId: string) => {
    router.push(`/essay/${essayId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading essays...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Essays</h1>
        <p className="text-gray-600">Manage and review your college application essays</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {essays.map((essay) => (
          <div
            key={essay.id}
            className="essay-card p-6 flex flex-col h-64 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
            onClick={() => handleCardClick(essay.id)}
          >
            <div className="flex-1 flex flex-col">
              {/* Header with title and badge */}
              <div className="flex items-start justify-between mb-4 flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-900 leading-tight flex-1 mr-3 line-clamp-2 h-12 overflow-hidden">
                  {essay.title}
                </h3>
                <Badge variant="secondary" className="flex-shrink-0">
                  {essay.type}
                </Badge>
              </div>

              {/* Content area */}
              <div className="flex-1 space-y-3">
                <div>
                  <span className="text-sm font-medium text-purple-700">School:</span>
                  <p className="text-gray-900">{essay.school}</p>
                </div>
                <div>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 