import * as React from "react";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-[0.8125rem] font-medium text-fg-muted",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
