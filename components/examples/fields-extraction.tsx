"use client";

import { useState } from "react";
import Demo, { DemoResult } from "../demo";
import { toast } from "sonner";

const FieldsExtraction = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DemoResult>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fieldsToExtract, setFieldsToExtract] = useState<string>("");

  const handleExtractFields = async () => {
    try {
      console.log(file, fieldsToExtract);
      if (!file || !fieldsToExtract) {
        toast.error("No file or fields to extract");
        return;
      }

      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fieldsToExtract", fieldsToExtract);

      const response = await fetch("/api/fields-extraction", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setResult({
        json: JSON.stringify(data, null, 2),
      });
    } catch {
      toast.error("Failed to extract fields");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Demo loading={loading} result={result}>
      <Demo.Left>
        <Demo.LeftContent>
          <Demo.FileUpload onUpload={(files) => setFile(files[0])} />
          <Demo.Textarea
            value={fieldsToExtract}
            placeholder="Enter fields to extract in natural language"
            onChange={(e) => setFieldsToExtract(e.target.value)}
          />
          <Demo.SubmitButton onClick={handleExtractFields}>
            Extract fields
          </Demo.SubmitButton>
        </Demo.LeftContent>
      </Demo.Left>
      <Demo.Right>
        <Demo.Result />
      </Demo.Right>
    </Demo>
  );
};

export default FieldsExtraction;
