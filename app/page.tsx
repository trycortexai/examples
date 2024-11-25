import { Icons } from "@/components/icons";
import { ExampleCards } from "@/components/example-cards";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { GITHUB_URL } from "@/constants/site";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="flex items-center justify-between w-full max-w-screen-lg px-4 py-2 mx-auto sm:px-6 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-2">
            <Icons.cortexIcon className="size-6" />
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              Cortex Examples
            </h1>
          </div>
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Icons.github className="size-4" />
            GitHub
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-screen-lg px-4 py-2 mx-auto sm:px-6">
        <ExampleCards />
      </main>
    </div>
  );
}
