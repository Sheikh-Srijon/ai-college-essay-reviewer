import { EditorClient } from "./EditorClient";
import { getMockEssay, getMockSuggestions } from "@/public/mockData";
import "../../../styles/suggestions.css";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const essay = getMockEssay(id);
  const suggestions = getMockSuggestions();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Essay #{essay.id}</h1>
      <EditorClient essay={essay} suggestions={suggestions} />
    </div>
  );
}