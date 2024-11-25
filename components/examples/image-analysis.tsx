"use client";

import { useState } from "react";
import Demo from "../demo";
import { toast } from "sonner";

const ImageAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [question, setQuestion] = useState<string>("");

  const handleAnalyzeImage = async () => {
    try {
      if (!image || !question) {
        toast.error("No image or question");
        return;
      }

      setLoading(true);
      setMarkdown("");

      const formData = new FormData();
      formData.append("image", image);
      formData.append("question", question);

      const response = await fetch("/api/image-analysis", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      setMarkdown(data.result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Demo
      heading="Image analysis"
      loading={loading && !markdown}
      markdown={markdown}
    >
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
          <Demo.SubmitButton onClick={handleAnalyzeImage}>
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
