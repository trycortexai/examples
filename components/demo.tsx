import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useRef,
} from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import FileDropzone from "./file-dropzone";

export type DemoResult = {
  json?: string;
  markdown?: string;
} | null;

type DemoContextType = {
  loading: boolean;
  result: DemoResult;
};

type UploadedFile = {
  fileName: string;
  fileUrl: string;
} | null;

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const Demo = ({
  children,
  ...props
}: PropsWithChildren<DemoContextType>) => {
  return (
    <DemoContext.Provider value={props}>
      <div className="flex h-screen w-full overflow-hidden">{children}</div>
    </DemoContext.Provider>
  );
};

const useDemoContext = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("Demo components must be used within a Demo provider");
  }
  return context;
};

Demo.Left = ({ children }: PropsWithChildren) => {
  const { loading, result } = useDemoContext();
  const showContent = loading || Boolean(result?.json || result?.markdown);
  return (
    <div
      className={cn("flex-grow h-screen transition-all duration-500", {
        "w-1/2": showContent,
        "w-full": !showContent,
      })}
    >
      {children}
    </div>
  );
};

Demo.Right = ({ children }: PropsWithChildren) => {
  const { loading, result } = useDemoContext();
  const showContent = loading || Boolean(result?.json || result?.markdown);
  return (
    <div
      className={cn(
        "h-screen flex-shrink-0 transition-all duration-500 border-l border-border bg-background overflow-y-auto",
        {
          "w-1/2": showContent,
          "w-0": !showContent,
        }
      )}
    >
      {children}
    </div>
  );
};

Demo.LeftContent = ({ children }: PropsWithChildren) => {
  return <div className="p-8">{children}</div>;
};

Demo.RightContent = ({ children }: PropsWithChildren) => {
  return <div className="p-8">{children}</div>;
};

interface FileUploadProps {
  multiple?: boolean;
  onUpload?: (files: { fileName: string; fileUrl: string }[]) => void;
}

Demo.FileUpload = ({ multiple = false, onUpload }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: File[] | File) => {
    try {
      const formData = new FormData();
      const fileArray = Array.isArray(files) ? files : [files];
      fileArray.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      if (data.files && onUpload) {
        onUpload(data.files);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files.length === 1 ? files[0] : Array.from(files));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] rounded-lg">
      <div className="w-full max-w-md space-y-6">
        <FileDropzone onUpload={handleUpload} multiple={multiple} />
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleManualUpload}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
          multiple={multiple}
        />
        <Button
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload File
        </Button>
      </div>
    </div>
  );
};

Demo.Result = () => {
  const { loading, result } = useDemoContext();
  return (
    <div className="flex flex-col h-full min-h-[400px] rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-medium">Result</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Processing...
          </div>
        ) : result ? (
          <div className="space-y-4">
            {result.json && (
              <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                <code>{result.json}</code>
              </pre>
            )}
            {result.markdown && (
              <div className="prose prose-sm max-w-none">{result.markdown}</div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Upload a file to see results
          </div>
        )}
      </div>
    </div>
  );
};
