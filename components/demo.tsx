import React, { PropsWithChildren, createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import FileDropzone from "./file-dropzone";
import { Textarea } from "./ui/textarea";
import { Button, ButtonProps } from "./ui/button";
import Spinner from "./spinner";
import { JsonViewer } from "./json-viewer";
import { parse, ALL } from "partial-json";
import Link from "next/link";
import { Icons } from "./icons";

export type DemoResult = {
  json?: string;
  markdown?: string;
} | null;

type DemoContextType = {
  loading: boolean;
  result: DemoResult;
  heading: string;
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const Demo = ({ children, ...props }: PropsWithChildren<DemoContextType>) => {
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

const DemoLeft = ({ children }: PropsWithChildren) => {
  const { loading, result, heading } = useDemoContext();
  const showContent = loading || Boolean(result?.json || result?.markdown);
  return (
    <div
      className={cn("flex-grow h-screen transition-all duration-500", {
        "w-1/2": showContent,
        "w-full": !showContent,
      })}
    >
      <div className="h-14 border-b border-border flex items-center px-8 gap-2">
        <Link href="/">
          <Icons.arrowLeft className="size-5 text-muted-foreground hover:text-foreground transition-colors" />
        </Link>
        <h1 className="text-lg font-medium">{heading}</h1>
      </div>
      <div className="flex justify-center items-center h-[calc(100vh-3.5rem)]">
        {children}
      </div>
    </div>
  );
};

const DemoRight = ({ children }: PropsWithChildren) => {
  const { loading, result } = useDemoContext();
  const showContent = loading || Boolean(result?.json || result?.markdown);
  return (
    <div
      className={cn(
        "h-screen flex-shrink-0 transition-all duration-500 border-l border-border bg-background overflow-y-auto",
        {
          "w-1/2": showContent,
          "w-0": !showContent,
        },
      )}
    >
      {children}
    </div>
  );
};

const DemoLeftContent = ({ children }: PropsWithChildren) => {
  return (
    <div className="p-8 flex flex-col items-center justify-center gap-4 w-[600px]">
      {children}
    </div>
  );
};

const DemoRightContent = ({ children }: PropsWithChildren) => {
  return (
    <div className="p-8 flex flex-col items-center justify-center gap-4">
      {children}
    </div>
  );
};

interface FileUploadProps {
  multiple?: boolean;
  onUpload: (files: File[]) => void;
}

const DemoFileUpload = ({ multiple = false, onUpload }: FileUploadProps) => {
  return (
    <div className="flex flex-col w-full items-center justify-center h-full rounded-lg">
      <FileDropzone onUpload={onUpload} multiple={multiple} />
    </div>
  );
};

const DemoResult = () => {
  const { loading, result } = useDemoContext();
  return (
    <div className="flex flex-col h-full min-h-[400px] rounded-lg">
      <div className="flex items-center h-14 justify-between px-4 border-b border-border">
        <h3 className="text-lg font-medium">Result</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Spinner icon="throbber" className="size-5" />
            Processing...
          </div>
        ) : result ? (
          <div className="space-y-4">
            {result.json && (
              <JsonViewer
                json={parse(result.json, ALL)}
                maxDepth={Infinity}
                truncatedByDefault={false}
              />
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

const DemoTextarea = ({
  className,
  ...props
}: React.ComponentProps<typeof Textarea>) => {
  return (
    <Textarea
      className={cn("min-h-[100px] max-h-[250px] w-full", className)}
      {...props}
    />
  );
};

const DemoSubmitButton = (props: ButtonProps) => {
  const { loading } = useDemoContext();
  return (
    <div className="flex justify-end w-full items-center">
      <Button {...props} disabled={loading} />
    </div>
  );
};

Demo.Left = DemoLeft;
Demo.Right = DemoRight;
Demo.LeftContent = DemoLeftContent;
Demo.RightContent = DemoRightContent;
Demo.FileUpload = DemoFileUpload;
Demo.Result = DemoResult;
Demo.Textarea = DemoTextarea;
Demo.SubmitButton = DemoSubmitButton;

export default Demo;
