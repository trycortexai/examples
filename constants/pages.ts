export const EXAMPLE_PAGES = [
  {
    title: "Fields Extraction",
    href: "/fields-extraction",
    description: "Extract fields from documents using natural language.",
  },
  {
    title: "Image Analysis",
    href: "/image-analysis",
    description:
      "Analyze and understand image content with AI - detect objects, extract text, and answer questions about images.",
  },
  {
    title: "Document Classification",
    href: "/document-classification",
    description:
      "Automatically categorize and organize documents into predefined categories.",
  },
];

export type ExamplePage = (typeof EXAMPLE_PAGES)[number];
