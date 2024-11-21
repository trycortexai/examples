import { makeCortexApiRequest } from "@/lib/cortex-api";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { Buffer } from "buffer";

type UploadedFile = {
  fileName: string;
  fileUrl: string;
} | null;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file): Promise<UploadedFile> => {
      if (file instanceof Blob) {
        // Convert file to base64 using Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Data = buffer.toString("base64");

        const data = await makeCortexApiRequest<{
          file_filename: string;
          file_url: string;
        }>({
          endpoint: "/files",
          method: "POST",
          body: {
            file: {
              data: base64Data,
              name: file instanceof File ? file.name : "file",
              type: file.type || "application/octet-stream",
            },
          },
        });

        return { fileName: data.file_filename, fileUrl: data.file_url };
      }
      return null;
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    return NextResponse.json({
      files: uploadedFiles.filter(Boolean),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
