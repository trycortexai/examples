import ImageAnalysis from "@/components/examples/image-analysis";

export const runtime = "edge";

export const metadata = {
  title: "Image Analysis",
  description:
    "Analyze images and get detailed answers to your questions about them",
};

export default function ImageAnalysisPage() {
  return <ImageAnalysis />;
}
