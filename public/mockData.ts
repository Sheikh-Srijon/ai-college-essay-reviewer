export interface Essay {
  id: string;
  text: string; // Markdown source
  version: number; // Incremented with each change
}

export interface RawSuggestion {
  id: string;
  originalText: string;
  editedText: string;
  note?: string;
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

export const mockRawSuggestions: RawSuggestion[] = [
  {
    id: "s1",
    originalText: "writting",
    editedText: "writing",
    note: "Spelling correction",
  },
  {
    id: "s2",
    originalText: "grammar",
    editedText: "grammar",
    note: "This word is spelled correctly",
  },
  {
    id: "s3",
    originalText: "fascenating",
    editedText: "fascinating",
    note: "Spelling correction",
  },
  {
    id: "s4",
    originalText: "engineer",
    editedText: "engineer",
    note: "This word is spelled correctly",
  },
];

export function getMockEssay(id: string): Essay {
  return { ...mockEssay, id };
}

export function getMockRawSuggestions(): RawSuggestion[] {
  return [...mockRawSuggestions];
}
