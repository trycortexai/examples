import FieldsExtraction from "@/components/examples/fields-extraction";

export const runtime = "edge";

export const metadata = {
  title: "Fields Extraction",
  description: "Extract fields from a document using natural language",
};

export default function FieldsExtractionPage() {
  return <FieldsExtraction />;
}
