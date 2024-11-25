import { NextRequest, NextResponse } from "next/server";
import { fileToBase64 } from "@/utils/file";
import cortex from "@/lib/cortex";

export const runtime = "edge";

const WORKFLOW_ID = process.env.FIELDS_EXTRACTION_WORKFLOW_ID!;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const fieldsToExtract = formData.get("fieldsToExtract");

    const fileUrl = await fileToBase64(file as File);

    const run = await cortex.apps.workflows.runs.create(WORKFLOW_ID, {
      input: {
        fields_to_extract: fieldsToExtract,
        document: fileUrl,
      },
      workflow_version_id: "latest",
    });

    return NextResponse.json(run);
  } catch (error) {
    return new Response(String(error), { status: 500 });
  }
}
