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
    description: "Ask questions about an image.",
    icon: Icons.image,
  },
];

export type ExamplePage = (typeof EXAMPLE_PAGES)[number];
