export const makeCortexApiRequest = async <T = Record<string, unknown>>({
  endpoint,
  method,
  body,
}: {
  endpoint: string;
  method: string;
  body: Record<string, unknown>;
}): Promise<T> => {
  if (!process.env.CORTEX_APP_ID || !process.env.CORTEX_API_KEY) {
    throw new Error("Missing required Cortex API configuration");
  }

  const baseUrl = "https://api.withcortex.ai/apps";
  const url = `${baseUrl}/${process.env.CORTEX_APP_ID}${endpoint}`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CORTEX_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Cortex API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(error);
    throw new Error(
      `Failed to make Cortex API request: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
};
