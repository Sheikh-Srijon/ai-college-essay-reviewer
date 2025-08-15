export interface Essay {
  id: string;
  text: string; // Markdown source
  version: number; // Incremented with each change
}

export interface Suggestion {
  id: string;
  anchor: { start: number; end: number; stickiness: "join_left" | "join_right" };
  originalText: string;
  editedText: string;
  note?: string;
  status: "open" | "approved" | "rejected" | "stale";
}

export const mockEssay: Essay = {
  id: "123",
  text: `# My College Essay

I really like writting essays.
They are good to improve skill.
Sometimes I make mistakes in grammar.
But I try to learn from them.

## Why I Want to Study Computer Science

Computer science is fascenating to me.
I enjoy solving problems and building things.
The field is constantly evolving and there's always something new to learn.
I believe technology can make the world a better place.

## My Goals

I want to become a software engineer.
I hope to work on projects that help people.
I'm excited about the future of artificial intelligence.
I believe in continuous learning and improvement.`,
  version: 1,
};

export const mockSuggestions: Suggestion[] = [
  {
    id: "s1",
    anchor: { start: 25, end: 33, stickiness: "join_left" },
    originalText: "writting",
    editedText: "writing",
    note: "Spelling correction",
    status: "open",
  },
  {
    id: "s2",
    anchor: { start: 67, end: 75, stickiness: "join_left" },
    originalText: "grammar",
    editedText: "grammar",
    note: "This word is spelled correctly",
    status: "open",
  },
  {
    id: "s3",
    anchor: { start: 120, end: 131, stickiness: "join_left" },
    originalText: "fascenating",
    editedText: "fascinating",
    note: "Spelling correction",
    status: "open",
  },
  {
    id: "s4",
    anchor: { start: 180, end: 190, stickiness: "join_left" },
    originalText: "engineer",
    editedText: "engineer",
    note: "This word is spelled correctly",
    status: "open",
  },
];

export function getMockEssay(id: string): Essay {
  return { ...mockEssay, id };
}

export function getMockSuggestions(): Suggestion[] {
  return [...mockSuggestions];
}
