import { PropsWithChildren, createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import FileDropzone from "./file-dropzone";
import { Textarea } from "./ui/textarea";
import { Button, ButtonProps } from "./ui/button";
import Spinner from "./spinner";
import { JsonViewer } from "./json-viewer";
import { parse, ALL } from "partial-json";
import Link from "next/link";
import { Icons } from "./icons";
import Markdown from "react-markdown";
import { EXAMPLE_PAGES } from "@/constants/pages";
import { usePathname } from "next/navigation";
import ShowCodeDialog from "./code-example-modal";

type DemoContextType = {
  loading: boolean;
  json?: string | Record<string, unknown> | null;
  markdown?: string;
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const Demo = ({ children, ...props }: PropsWithChildren<DemoContextType>) => {
  return (
    <DemoContext.Provider value={props}>
      <div className="flex min-h-screen w-full">{children}</div>
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
  const { loading, json, markdown } = useDemoContext();
  const showContent = loading || Boolean(json || markdown);

  const pathname = usePathname();
  const { title, code } = EXAMPLE_PAGES.find((page) => page.href === pathname)!;

  return (
    <div
      className={cn("flex-grow min-h-screen transition-all duration-500", {
        "w-1/2": showContent,
        "w-full": !showContent,
      })}
    >
      <div className="h-14 border-b bg-background z-50 sticky top-0 border-border flex items-center px-8 gap-2">
        <Link href="/">
          <Icons.arrowLeft className="size-5 text-muted-foreground hover:text-foreground transition-colors" />
        </Link>
        <h1 className="text-lg font-medium">{title}</h1>
        <div className="ml-auto">
          <ShowCodeDialog title={title} code={code}>
            <Button variant="outline" size="sm" className="gap-2">
              <Icons.code className="size-4" />
              Show Code
            </Button>
          </ShowCodeDialog>
        </div>
      </div>
      <div className="flex sticky top-14 justify-center items-center min-h-[calc(100vh-3.5rem)]">
        {children}
      </div>
    </div>
  );
};

const DemoRight = ({ children }: PropsWithChildren) => {
  const { loading, json, markdown } = useDemoContext();
  const showContent = loading || Boolean(json || markdown);
  return (
    <div
      className={cn(
        "min-h-screen flex-shrink-0 transition-all duration-500 border-l border-border bg-background overflow-y-auto",
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
  acceptImagesOnly?: boolean;
}

const DemoFileUpload = ({
  multiple = false,
  onUpload,
  acceptImagesOnly = false,
}: FileUploadProps) => {
  return (
    <div className="flex flex-col w-full items-center justify-center h-full rounded-lg">
      <FileDropzone
        onUpload={onUpload}
        multiple={multiple}
        acceptImagesOnly={acceptImagesOnly}
      />
    </div>
  );
};

const DemoResult = () => {
  const { loading, json, markdown } = useDemoContext();
  return (
    <div className="flex flex-col min-h-[400px] rounded-lg">
      <div className="flex items-center h-14 justify-between px-6 border-b border-border sticky top-0 bg-background">
        <h3 className="text-lg font-medium">Result</h3>
      </div>
      <div className="flex-1 p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Spinner icon="throbber" className="size-5" />
          </div>
        ) : json || markdown ? (
          <div className="space-y-4">
            {json && (
              <JsonViewer
                json={typeof json === "string" ? parse(json, ALL) : json}
                maxDepth={Infinity}
                truncatedByDefault={false}
              />
            )}
            {markdown && (
              <Markdown className="prose max-w-none" skipHtml>
                {markdown}
              </Markdown>
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
