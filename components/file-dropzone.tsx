import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Icons } from "./icons";

interface FileDropzoneProps {
  onUpload: (files: File[]) => void;
  multiple?: boolean;
}

const FileDropzone = ({ onUpload, multiple = false }: FileDropzoneProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onUpload(acceptedFiles);
    },
    [onUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxSize: 100 * 1024 * 1024, // 100mb
  });

  return (
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
              Drag and drop your file here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">Files up to 100MB</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileDropzone;
