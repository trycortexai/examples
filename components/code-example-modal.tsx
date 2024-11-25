import { PropsWithChildren } from "react";
import CodeBlock from "./code-block";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type ShowCodeDialogProps = PropsWithChildren<{
  title: string;
  code: { workflowSchema: string; callCode: string };
}>;

function ShowCodeDialog({
  children,
  title,
  code: { workflowSchema, callCode },
}: ShowCodeDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[80vh] min-w-[850px]">
        <DialogHeader>
          <DialogTitle>{title} Code</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="run">
          <TabsList>
            <TabsTrigger value="run">Run Workflow</TabsTrigger>
            <TabsTrigger value="schema">Workflow Schema</TabsTrigger>
          </TabsList>
          <TabsContent value="run">
            <CodeBlock
              language="javascript"
              className="max-h-[65vh] max-w-[800px] overflow-y-auto"
            >
              {callCode}
            </CodeBlock>
          </TabsContent>
          <TabsContent value="schema">
            <CodeBlock
              language="json"
              className="max-h-[65vh] max-w-[800px] overflow-y-auto"
            >
              {workflowSchema}
            </CodeBlock>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default ShowCodeDialog;
