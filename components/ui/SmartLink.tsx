import type { CSSProperties, ReactNode } from "react";
import { cn, isExternal, isPlaceholder } from "@/lib/utils";

type SmartLinkProps = {
  href?: string;
  children: ReactNode;
  className?: string;
  label: string;
  download?: boolean;
  style?: CSSProperties;
};

/**
 * An anchor that degrades honestly: while `href` is still an `[ADD …]` placeholder it
 * renders a disabled, clearly-marked element instead of a dead link.
 */
export function SmartLink({ href, children, className, label, download, style }: SmartLinkProps) {
  if (isPlaceholder(href)) {
    return (
      <span
        role="link"
        aria-disabled="true"
        aria-label={`${label} (not set yet)`}
        title={`${label} is not set yet. Edit data/site.ts`}
        style={style}
        className={cn("cursor-not-allowed opacity-50", className)}
      >
        {children}
      </span>
    );
  }
  const external = isExternal(href!);
  return (
    <a
      href={href}
      aria-label={label}
      className={className}
      style={style}
      download={download || undefined}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
