import { createParser } from "eventsource-parser";

export const readSSE = async (
  response: Response,
  onData: (eventId: string | undefined, response: unknown) => void
) => {
  const decoder = new TextDecoder();

  const parser = createParser({
    onEvent: (event) => {
      onData(event.event ?? "unknown", JSON.parse(event.data));
    },
    onRetry: (retry) => {
      console.log("reconnect interval %d ms", retry);
    },
  });

  const reader = response.body!.getReader();

  async function* readStream() {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        parser.feed(decoder.decode(value));
        yield value;
      }
    } finally {
      reader.releaseLock();
    }
  }

  for await (const _ of readStream()) _;
};
