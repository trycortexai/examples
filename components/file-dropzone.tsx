import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Icons } from "./icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { JsonViewer } from "./json-viewer";

interface FileDropzoneProps {
  onUpload: (files: File[]) => void;
  multiple?: boolean;
}

const FileDropzone = ({ onUpload, multiple = false }: FileDropzoneProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      onUpload(acceptedFiles);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const handlePreview = async (file: File) => {
    setPreviewFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewContent(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/json") {
      const text = await file.text();
      try {
        setPreviewContent(text);
      } catch {
        setPreviewContent("Invalid JSON file");
      }
    } else if (
      file.type === "text/plain" ||
      file.type === "text/markdown" ||
      file.type === "text/csv"
    ) {
      const text = await file.text();
      setPreviewContent(text);
    } else if (file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setPreviewContent(url);
    } else if (file.type.startsWith("text/")) {
      const text = await file.text();
      setPreviewContent(text);
    } else {
      setPreviewContent("Preview not available for this file type");
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-foreground transition-colors h-[200px] flex flex-col justify-center w-full"
      >
        <input {...getInputProps()} className="sr-only" />
        <div className="space-y-2">
          <div className="h-10 flex items-center justify-center">
            <Icons.cloudUpload
              strokeWidth={1.5}
              className="size-10 text-muted-foreground"
            />
          </div>
          {isDragActive ? (
            <p className="text-sm">Drop the files here...</p>
          ) : (
            <>
              <p className="text-sm">
                Drag and drop your {multiple ? "files" : "file"} here, or click
                to browse
              </p>
              <p className="text-xs text-muted-foreground">Files up to 100MB</p>
            </>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <Badge
                  variant="secondary"
                  className="px-2 py-1.5 cursor-pointer rounded-sm font-normal border border-transparent hover:border-border"
                  onClick={() => handlePreview(file)}
                >
                  {file.type.startsWith("image/") ? (
                    <Icons.image className="mr-1 size-3" />
                  ) : (
                    <Icons.file className="mr-1 size-3" />
                  )}
                  {file.name}
                </Badge>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {file.type.startsWith("image/") ? (
                      <Icons.image className="size-4" />
                    ) : (
                      <Icons.file className="size-4" />
                    )}
                    {file.name}
                  </DialogTitle>
                  <DialogDescription>
                    {file.type || "No type"} • {(file.size / 1024).toFixed(1)}KB
                  </DialogDescription>
                </DialogHeader>
                <div className="overflow-auto max-h-[80vh]">
                  {previewContent &&
                    file === previewFile &&
                    (file.type.startsWith("image/") ? (
                      <img
                        src={previewContent}
                        alt={file.name}
                        className="max-w-full rounded-lg"
                      />
                    ) : file.type === "application/json" ? (
                      <JsonViewer json={JSON.parse(previewContent)} />
                    ) : file.type === "application/pdf" ? (
                      <object
                        data={previewContent}
                        type="application/pdf"
                        className="w-full h-[80vh] border rounded-lg"
                      >
                        <p>
                          Your browser does not support PDF previews.{" "}
                          <a
                            href={previewContent}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download the PDF
                          </a>
                        </p>
                      </object>
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm p-4 bg-muted rounded-lg">
                        {previewContent}
                      </pre>
                    ))}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
