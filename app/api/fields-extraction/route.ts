import { NextRequest, NextResponse } from "next/server";
import { makeCortexApiRequest } from "@/lib/cortex-api";
import { fileToBase64 } from "@/utils/file";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const fieldsToExtract = formData.get("fieldsToExtract");

    const fileUrl = await fileToBase64(file as File);

    const run = await makeCortexApiRequest({
      endpoint: `/workflows/${process.env.FIELDS_EXTRACTION_WORKFLOW_ID}/runs`,
      method: "POST",
      body: {
        input: {
          fields_to_extract: fieldsToExtract,
          document: fileUrl,
        },
        workflow_version_id: "draft",
        stream: false,
      },
    });

    return NextResponse.json(run);
  } catch (error) {
    return new Response(String(error), { status: 500 });
  }
}
