import { NextRequest } from "next/server";
import { makeCortexApiRequest } from "@/lib/cortex-api";
import { fileToBase64 } from "@/utils/file";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");
    const question = formData.get("question");

    const imageUrl = await fileToBase64(image as File);

    const stream = await makeCortexApiRequest({
      endpoint: `/workflows/${process.env.IMAGE_ANALYSIS_WORKFLOW_ID}/runs`,
      method: "POST",
      body: {
        input: {
          image: imageUrl,
          question,
        },
        workflow_version_id: "draft",
        stream: true,
      },
      options: {
        stream: true,
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(String(error), { status: 500 });
  }
}
