import ImageAnalysis from "@/components/examples/image-analysis";

export const runtime = "edge";

export const metadata = {
  title: "Image Analysis",
  description: "Ask questions about an image",
};

export default function ImageAnalysisPage() {
  return <ImageAnalysis />;
}
