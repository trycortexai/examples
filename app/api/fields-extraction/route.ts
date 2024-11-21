import { makeCortexApiRequest } from "@/lib/cortex-api";
import { fileToBase64 } from "@/utils/file";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");
  const fieldsToExtract = formData.get("fieldsToExtract");

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const fileUrl = await fileToBase64(file as File);

  try {
    const data = await makeCortexApiRequest({
      endpoint: `/workflows/${process.env.FIELDS_EXTRACTION_WORKFLOW_ID}/runs`,
      method: "POST",
      body: {
        input: {
          schema: fieldsToExtract,
          document: fileUrl,
        },
      },
    });

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    return NextResponse.json(data.result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to extract fields" },
      { status: 500 },
    );
  }
}
