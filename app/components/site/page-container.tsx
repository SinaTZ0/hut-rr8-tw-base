import { cn } from "cn";
import type { ReactNode } from "react";

/*===== Shared Page Width =====*/

export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10", className)}>{children}</div>;
}
