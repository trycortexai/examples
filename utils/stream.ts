import { parse, ALL } from "partial-json";

type StreamResponseOptions<T> = {
  response: Response;
  onData: (data: T) => void;
  onError?: (error: any) => void;
  onComplete?: () => void;
};

export const streamResponse = async <T extends Record<string, any>>({
  response,
  onData,
  onError,
  onComplete,
}: StreamResponseOptions<T>) => {
  try {
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from API:", errorText);
      onError?.(new Error(response.statusText));
      return;
    }

    if (!response.body) {
      console.error("No response body");
      onError?.(new Error("No response body from API"));
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let buffer = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const jsonStr = line.startsWith("data: ") ? line.slice(6) : line;
            const data = parse(jsonStr, ALL);

            onData(data);
          } catch (e) {
            continue;
          }
        }
      }
    }

    onComplete?.();
  } catch (error) {
    console.error("Streaming Error:", error);
    onError?.(error);
  }
};
