import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileDropzoneProps {
  onUpload: (files: File[] | File) => void;
  multiple?: boolean;
}

const FileDropzone = ({ onUpload, multiple = false }: FileDropzoneProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onUpload(multiple ? acceptedFiles : acceptedFiles[0]);
    },
    [multiple, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-foreground transition-colors"
    >
      <input {...getInputProps()} className="sr-only" />
      <div>
        {isDragActive ? (
          <p className="text-sm">Drop the files here...</p>
        ) : (
          <>
            <p className="text-sm">
              Drag and drop your file here, or click to browse
            </p>
            <p className="text-xs mt-2">Supports PDF, PNG, JPG up to 10MB</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileDropzone;
