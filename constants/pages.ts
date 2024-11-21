import { Icons } from "@/components/icons";

export const EXAMPLE_PAGES = [
  {
    title: "Fields Extraction",
    href: "/fields-extraction",
    description: "Extract fields from documents using natural language.",
    icon: Icons.text,
  },
  {
    title: "Image Analysis",
    href: "/image-analysis",
    description:
      "Analyze and understand image content - detect objects, extract text, and answer questions about images.",
    icon: Icons.image,
  },
  {
    title: "Document Classification",
    href: "/document-classification",
    description:
      "Automatically categorize and organize documents into predefined categories.",
    icon: Icons.classification,
  },
];

export type ExamplePage = (typeof EXAMPLE_PAGES)[number];
