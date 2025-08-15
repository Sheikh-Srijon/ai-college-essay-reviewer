// mockDataAdvanced.ts

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

export const mockEssayAdvanced: Essay = {
  id: "adv-001",
  text: `# Mock Essay (Advanced)

I've encountered challenges in grasping the world of olympiads and extracurricular activities because my family primarily emphasizes academics, driven by the belief that it leads to tangible outcomes like social status and financial assets. I embarked on an unconventional journey, growing up in a modest environment with limited opportunities, tempered expectations, and the looming threat of failure. I have always been a little bit of an introvert and have always been hesitant to take the initiative. It was during my formative years that rejection shaped my path. A highly respected teacher received my article with cold disdain because I had written it in a juvenile manner for the school magazine. It stung, but it didn't deter me. I harbored a deep fear of leadership, even shying away from the prospect of becoming a class captain.

For the first time in my life, I decided to step out of my comfort zone and venture into the realm of technology. I joined the IT club at my school, a move that was to alter my course dramatically. This new world introduced me to a love of coding, gaming, and the limitless possibilities of graphic design. As my skills grew, so did my confidence. The opportunity arose to become a general member of the English Language Club (ELC). With the title "The most valuable resource is no longer oil, but data," I secured the third position among 15 candidates, an achievement that hinted at my emerging writing potential. It was a source of immense pride and encouragement. A senior-led ELC festival tested our skills. Nine school teams competed; we won. As a graphics team head, I made 17 posters in 4 hours. It was a testament to teamwork and resilience. Those six days taught me different qualities:patience! yes, definitely,haha!

My father has been a figure of inspiration since my birth. He had instilled in me the values of determination and leadership. He served as the regional Rotary International Vice President and directed the regional chamber of commerce, setting an example that I aspired to follow. He is always encouraging me to adopt these noble qualities from him and others.

However, my journey wasn't without its share of setbacks. I attempted my first physics olympiad and fell short. It was a humbling moment and a reminder that success requires perseverance and learning from failures.
Fast forward to my 20s; a phone call at 9:42 p.m. changed the course of my life. I received a call from a mysterious female voice inviting me to compete in the Economics Olympiad's national round. Although I lacked expertise in economics, incidents such as the documentary on the "billion-dollar heist" at the Bangladesh Bank and data breaches
of national ID information had piqued my interest in fintech and cybersecurity. I was determined to learn more about this sector because I am able to ensure effective solutions. The risk of website vulnerabilities being exploited is a pressing concern. Since data is a personal and national asset, quick action is required. My dream is to establish a stronghold in this field, creating a fortress in my country that not only resolves these pressing issues but also opens avenues for tackling unemployment, ultimately fostering economic growth.

Over time, I participated in numerous Olympiads focusing on technology and climate change. Some ventures ended in failure, but they were integral to my growth. I'd often heard that being a Shakib Al Hasan, an all-rounder in real life, was a formidable task, but I was determined to be the best version of myself. I held onto a belief: "Break by 30, or build for life." Every challenge and opportunity shapes my journey, led by a passion for technology and the belief that, in the words of the anthem that inspired me, I am "bulletproof" (Titanium).
`,
  version: 1,
};

export const mockRawSuggestionsAdvanced: RawSuggestion[] = [
  {
    id: "a1",
    originalText: `I've encountered challenges in grasping the world of olympiads and extracurricular activities because my family primarily emphasizes academics, driven by the belief that it leads to tangible outcomes like social status and financial assets.`,
    editedText: `I struggled to navigate Olympiads and extracurriculars; in my family, academics reigned supreme as the surest path to social standing and financial stability.`,
    note: `Capitalizes "Olympiads," tightens phrasing, stronger hook.`,
  },
  {
    id: "a2",
    originalText: `I embarked on an unconventional journey, growing up in a modest environment with limited opportunities, tempered expectations, and the looming threat of failure.`,
    editedText: `I grew up in a modest environment—limited opportunities, tempered expectations, and the constant shadow of failure—yet chose an unconventional path.`,
    note: `Improves rhythm; em dashes elevate cadence.`,
  },
  {
    id: "a3",
    originalText: `A highly respected teacher received my article with cold disdain because I had written it in a juvenile manner for the school magazine.`,
    editedText: `A respected teacher dismissed my school magazine article as "juvenile."`,
    note: `Concise; shows instead of tells via quotation.`,
  },
  {
    id: "a4",
    originalText: `It stung, but it didn't deter me.`,
    editedText: `The sting lingered, but so did my resolve.`,
    note: `Stronger parallel structure.`,
  },
  {
    id: "a5",
    originalText: `With the title "The most valuable resource is no longer oil, but data," I secured the third position among 15 candidates, an achievement that hinted at my emerging writing potential.`,
    editedText: `With an essay titled "The most valuable resource is no longer oil, but data," I placed third among fifteen candidates—my first glimmer of writing potential.`,
    note: `Clarity; spell out numbers; em dash emphasis.`,
  },
  {
    id: "a6",
    originalText: `Those six days taught me different qualities:patience! yes, definitely,haha!`,
    editedText: `Those six days taught me patience most of all.`,
    note: `Removes casual interjections; formal tone.`,
  },
  {
    id: "a7",
    originalText: `My father has been a figure of inspiration since my birth.`,
    editedText: `My father has been a constant source of inspiration.`,
    note: `Smoother; avoids overstatement.`,
  },
  {
    id: "a8",
    originalText: `I attempted my first physics olympiad and fell short.`,
    editedText: `I attempted my first Physics Olympiad—and fell short.`,
    note: `Capitalize proper noun; dramatic pause.`,
  },
  {
    id: "a9",
    originalText: `Although I lacked expertise in economics, incidents such as the documentary on the "billion-dollar heist" at the Bangladesh Bank and data breaches\nof national ID information had piqued my interest in fintech and cybersecurity.`,
    editedText: `Though I lacked expertise in economics, events like the "billion-dollar heist" at Bangladesh Bank and breaches of national ID data sparked my interest in fintech and cybersecurity.`,
    note: `Smoother cause–effect; tighter phrasing.`,
  },
  {
    id: "a10",
    originalText: `My primary objective is to immerse myself in this sector because I am able to ensure effective solutions.`,
    editedText: `My goal is to immerse myself in this sector to develop effective, lasting solutions.`,
    note: `Removes awkward "because I am able to ensure."`,
  },
  {
    id: "a11",
    originalText: `My dream is to establish a stronghold in this field, creating a fortress in my country that not only resolves these pressing issues but also opens avenues for tackling unemployment, ultimately fostering economic growth.`,
    editedText: `I dream of building a national stronghold in this field—a fortress that safeguards against cyber threats, tackles unemployment, and fosters economic growth.`,
    note: `Keeps metaphor; condenses and sharpens.`,
  },
  {
    id: "a12",
    originalText: `I'd often heard that being a Shakib Al Hasan, an all-rounder in real life, was a formidable task, but I was determined to be the best version of myself.`,
    editedText: `I'd often heard that being a real-life "Shakib Al Hasan"—an all-rounder—was formidable, but I was determined to be my best self.`,
    note: `Quotation marks for clarity; polished phrasing.`,
  },
  {
    id: "a13",
    originalText: `Every challenge and opportunity shapes my journey, led by a passion for technology and the belief that, in the words of the anthem that inspired me, I am "bulletproof" (Titanium).`,
    editedText: `Every challenge shapes my journey, driven by a passion for technology and the belief—echoing the anthem that inspires me—that I am "bulletproof" (*Titanium*).`,
    note: `Integrates song reference more fluidly; italicizes title.`,
  },
];

export function getMockEssay(id = "adv-001"): Essay {
  return { ...mockEssayAdvanced, id };
}

export function getMockRawSuggestions(): RawSuggestion[] {
  return mockRawSuggestionsAdvanced.map((s) => ({ ...s }));
}
