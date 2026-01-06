/**
 * 共通レイアウト
 */

import type { ComponentChildren } from "preact";

interface LayoutProps {
  children: ComponentChildren;
}

export function Layout({ children }: LayoutProps) {
  return <div class="container">{children}</div>;
}
