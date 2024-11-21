"use client";

import { useState, useEffect } from "react";
import { Demo, DemoResult } from "../demo";

const FieldsExtraction = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DemoResult>(null);

  useEffect(() => {
    // Simulate loading after 2 seconds
    const loadingTimeout = setTimeout(() => {
      setLoading(true);

      // Simulate result after 3 more seconds
      const resultTimeout = setTimeout(() => {
        setLoading(false);
        setResult({
          json: JSON.stringify(
            {
              name: "John Doe",
              email: "john@example.com",
              phone: "123-456-7890",
            },
            null,
            2
          ),
          markdown:
            "# Extracted Fields\n\n- **Name:** John Doe\n- **Email:** john@example.com\n- **Phone:** 123-456-7890",
        });
      }, 3000);

      return () => clearTimeout(resultTimeout);
    }, 2000);

    return () => clearTimeout(loadingTimeout);
  }, []);

  return (
    <Demo loading={loading} result={result}>
      <Demo.Left>
        <Demo.FileUpload onUpload={(files) => console.log(files)} />
      </Demo.Left>
      <Demo.Right>
        <Demo.Result />
      </Demo.Right>
    </Demo>
  );
};

export default FieldsExtraction;
