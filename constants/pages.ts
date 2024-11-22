import { Icons } from "@/components/icons";

export const EXAMPLE_PAGES = [
  {
    title: "Fields Extraction",
    href: "/fields-extraction",
    description: "Extract fields from documents using natural language.",
    icon: Icons.text,
    code: {
      workflowSchema: ``,
      callCode: ``,
    },
  },
  {
    title: "Image Analysis",
    href: "/image-analysis",
    description:
      "Analyze images and get detailed answers to your questions about them.",
    icon: Icons.image,
  },
];

export type ExamplePage = (typeof EXAMPLE_PAGES)[number];
