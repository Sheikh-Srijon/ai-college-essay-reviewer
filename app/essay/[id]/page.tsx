import { EditorClient } from "./EditorClient";
import { getMockEssay, getMockRawSuggestions } from "@/public/mockDataAdvanced";
// import { getMockEssay, getMockRawSuggestions } from "@/public/mockData";
import { RubricScoringClient } from "./RubricScoringClient";

import "../../../styles/suggestions.css";
import { MetaEssayFeedbackClient } from "./MetaEssayFeedbackClient";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const essay = getMockEssay(id);
  const rawSuggestions = getMockRawSuggestions();

  return (
    // <div className="max-w-4xl mx-auto p-6">
    <div>
      <EditorClient essay={essay} rawSuggestions={rawSuggestions} />
      <MetaEssayFeedbackClient essayId={id} />
      <RubricScoringClient essayId={id} />
    </div>

    // </div>
  );
}