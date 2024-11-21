import { Icons } from "@/components/icons";
import { ExampleCards } from "@/components/example-cards";
export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-8 md:p-12 lg:p-20 max-w-screen-lg mx-auto">
      <Icons.cortexIcon className="size-8 sm:size-10 md:size-12" />
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mt-4 sm:mt-6 tracking-tight text-center">
        Cortex Examples
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-muted-foreground mt-2 text-center font-medium max-w-2xl">
        A collection of examples showcasing Cortex.
      </p>
      <ExampleCards />
    </div>
  );
}
