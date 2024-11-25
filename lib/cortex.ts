import { Cortex } from "@cortex-ai/sdk";

const cortex = new Cortex({
  apiKey: process.env.CORTEX_API_KEY!,
});

export default cortex;
