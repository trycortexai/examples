type CortexApiOptions = {
  endpoint: string;
  method: string;
  body: Record<string, unknown>;
  options?: {
    stream?: boolean;
  };
};

type CortexApiResponse<T extends boolean | undefined> = T extends true
  ? ReadableStream<Uint8Array>
  : any;

export const makeCortexApiRequest = async <T extends boolean | undefined>({
  endpoint,
  method,
  body,
  options = {},
}: CortexApiOptions): Promise<CortexApiResponse<T>> => {
  if (!process.env.CORTEX_APP_ID || !process.env.CORTEX_API_KEY) {
    throw new Error("Missing required Cortex API configuration");
  }

  const baseUrl = "https://api.withcortex.ai/apps";
  const url = `${baseUrl}/${process.env.CORTEX_APP_ID}${endpoint}`;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CORTEX_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Cortex API request failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  if (options.stream) {
    return response.body as CortexApiResponse<T>;
  }

  return response.json() as CortexApiResponse<T>;
};
