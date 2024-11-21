import React from "react";

import { Icons } from "./icons";
import { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

type SpinnerProps = LucideProps & {
  icon?: "spinner" | "throbber";
};

const Spinner = ({ className, icon = "spinner", ...props }: SpinnerProps) => {
  const Icon = Icons[icon];
  return <Icon className={cn("animate-spin size-4", className)} {...props} />;
};

export default Spinner;
