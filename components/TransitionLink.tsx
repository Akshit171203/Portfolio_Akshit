"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { usePageTransition } from "./TransitionProvider";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** Big word shown on the curtain while the page changes. */
  label?: string;
  /** Palette name for the curtain: coral, lime, lilac, sky, butter, mint, pink or ink. */
  color?: string;
};

/** A next/link that plays the page-transition curtain. Modified clicks fall through to the browser. */
export function TransitionLink({ href, label, color, onClick, ...rest }: Props) {
  const go = usePageTransition();
  return (
    <Link
      href={href}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        go(href, { label, color });
      }}
      {...rest}
    />
  );
}
