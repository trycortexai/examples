import { NextRequest, NextResponse } from "next/server";
import { fileToBase64 } from "@/utils/file";
import cortex from "@/lib/cortex";

export const runtime = "edge";

const WORKFLOW_ID = process.env.IMAGE_ANALYSIS_WORKFLOW_ID!;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");
    const question = formData.get("question");

    const imageUrl = await fileToBase64(image as File);

    const streamResponse = await cortex.apps.workflows.runs.streamResponse(
      WORKFLOW_ID,
      {
        input: {
          image: imageUrl,
          question,
        },
        workflow_version_id: "latest",
      }
    );

    return new NextResponse(streamResponse.body);
  } catch (error) {
    return new NextResponse(String(error), { status: 500 });
  }
}
