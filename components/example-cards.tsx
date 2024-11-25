import { EXAMPLE_PAGES, ExamplePage } from "@/constants/pages";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";
import ShowCodeDialog from "./code-example-modal";

export function ExampleCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-12">
      {EXAMPLE_PAGES.map((page) => (
        <ExampleCard key={page.href} {...page} />
      ))}
    </div>
  );
}

export function ExampleCard({
  title,
  href,
  description,
  icon,
  code,
}: ExamplePage) {
  const Icon = icon;
  return (
    <div className="group flex hover:ring-2 transition-all duration-300 hover:ring-offset-2 hover:ring-offset-card flex-col h-full overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-3">
          <Icon className="size-6 text-muted-foreground" />
          <h3 className="font-semibold text-xl tracking-tight">{title}</h3>
        </div>
        <p className="mt-3 text-muted-foreground leading-normal">
          {description}
        </p>
      </div>
      <div className="grid grid-cols-2 border-t">
        <ShowCodeDialog title={title} code={code}>
          <Button variant="ghost" className="rounded-none h-12 hover:bg-accent">
            <Icons.code />
            Show Code
          </Button>
        </ShowCodeDialog>
        <Link href={href} className={cn(buttonVariants(), "rounded-none h-12")}>
          Demo
        </Link>
      </div>
    </div>
  );
}
