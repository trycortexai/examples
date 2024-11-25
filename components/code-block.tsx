import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type CodeBlockProps = {
  language: string;
  className?: string;
  children: string;
};

const CodeBlock = ({ children, language, className }: CodeBlockProps) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={oneDark}
      className={className}
      customStyle={{
        fontFamily: "var(--font-mono)",
      }}
    >
      {children}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
