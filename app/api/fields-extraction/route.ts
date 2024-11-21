import { makeCortexApiRequest } from "@/lib/cortex-api";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { file, fieldsToExtract } = await request.json();
  try {
    const data = await makeCortexApiRequest({
      endpoint: `/workflows/${process.env.FIELDS_EXTRACTION_WORKFLOW_ID}/runs`,
      method: "POST",
      body: {
        input: {
          schema: fieldsToExtract,
          document: file.fileUrl,
        },
      },
    });

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    return NextResponse.json(data.result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
