import { Icons } from "@/components/icons";
import { ExampleCards } from "@/components/example-cards";
export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-8 sm:p-20 max-w-screen-lg mx-auto">
      <Icons.cortexIcon className="size-12" />
      <h1 className="text-5xl font-semibold mt-6 tracking-tight text-center">
        Cortex Examples
      </h1>
      <p className="text-muted-foreground mt-2 text-center text-xl font-medium">
        A collection of examples showcasing Cortex.
      </p>
      <ExampleCards />
    </div>
  );
}
