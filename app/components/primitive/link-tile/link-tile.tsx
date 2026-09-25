import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { ArrowUpLeft } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import {
  linkTileVariants,
  iconVariants,
  contentVariants,
  labelVariants,
  descriptionVariants,
  arrowVariants,
} from "./link-tile.styles";

/*===== LinkTile =====*/

export type LinkTileProps = useRender.ComponentProps<"a"> &
  VariantProps<typeof linkTileVariants> & {
    children: ReactNode;
    icon?: ReactNode;
    description?: ReactNode;
  };

/**
 * A link with a label, optional decorative icon and description, and a directional arrow.
 * Renders a native anchor by default and supports router links through `render`.
 * Keep interactive elements out of children/description and put page-grid borders on containing layout elements.
 */
function LinkTile({ className, children, icon, description, variant, render, ...props }: LinkTileProps) {
  return useRender({
    defaultTagName: "a",
    render,
    props: mergeProps<"a">(
      {
        "data-slot": "link-tile",
        "data-variant": variant ?? "row",
        className: cn(linkTileVariants({ variant }), className),
        children: (
          <>
            {icon != null && (
              <span data-slot="link-tile-icon" className={cn(iconVariants({ variant }))} aria-hidden="true">
                {icon}
              </span>
            )}
            <span data-slot="link-tile-content" className={cn(contentVariants({ variant }))}>
              <span data-slot="link-tile-label" className={cn(labelVariants({ variant }))}>
                {children}
              </span>
              {description != null && (
                <span data-slot="link-tile-description" className={cn(descriptionVariants({ variant }))}>
                  {description}
                </span>
              )}
            </span>
            <ArrowUpLeft data-slot="link-tile-arrow" className={cn(arrowVariants({ variant }))} aria-hidden="true" />
          </>
        ),
      } as ComponentProps<"a">,
      props,
    ),
    state: { slot: "link-tile", variant },
  });
}

export { LinkTile };
export default LinkTile;
