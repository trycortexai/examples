"use client";

import { useState } from "react";
import Demo, { DemoResult } from "../demo";
import { toast } from "sonner";
import { streamResponse } from "@/utils/stream";

const ImageAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DemoResult>(null);
  const [image, setImage] = useState<File | null>(null);
  const [question, setQuestion] = useState<string>("");

  const handleExtractFields = async () => {
    try {
      if (!image || !question) {
        toast.error("No image or question");
        return;
      }

      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("image", image);
      formData.append("question", question);

      const response = await fetch("/api/image-analysis", {
        method: "POST",
        body: formData,
      });

      await streamResponse<{
        key: string;
        output: { message: string };
      }>({
        response,
        onData: (data) => {
          if (data.key === "MODEL_ANALYZE" && data.output.message) {
            setResult((prev) => ({
              markdown: (prev?.markdown || "") + data.output.message,
            }));
          }
        },
        onError: (error) => {
          toast.error(error.message);
          setLoading(false);
        },
        onComplete: () => {
          setLoading(false);
        },
      });
    } catch {
      toast.error("Failed to analyze image");
      setLoading(false);
    }
  };

  return (
    <Demo heading="Image analysis" loading={loading && !result} result={result}>
      <Demo.Left>
        <Demo.LeftContent>
          <Demo.FileUpload
            onUpload={(files) => setImage(files[0])}
            acceptImagesOnly
          />
          <Demo.Textarea
            value={question}
            placeholder="Eg: What is the name of the person in the image?"
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Demo.SubmitButton onClick={handleExtractFields}>
            Analyze image
          </Demo.SubmitButton>
        </Demo.LeftContent>
      </Demo.Left>
      <Demo.Right>
        <Demo.Result />
      </Demo.Right>
    </Demo>
  );
};

export default ImageAnalysis;
