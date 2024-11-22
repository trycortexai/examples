import { Icons } from "@/components/icons";
import { ExampleCards } from "@/components/example-cards";
export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-8 md:p-12 lg:p-20 max-w-screen-lg mx-auto">
      <Icons.cortexIcon className="size-6 sm:size-8 md:size-10" />
      <h1 className="text-2xl md:text-3xl font-semibold sm:mt-6 tracking-tight text-center">
        Cortex Examples
      </h1>
      <p className="text-base sm:text-lg text-muted-foreground mt-2 text-center font-medium max-w-2xl">
        A collection of examples showcasing Cortex.
      </p>
      <ExampleCards />
    </div>
  );
}
