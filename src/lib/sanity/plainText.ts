import type { PortableTextBlock } from "sanity";

/** Flattens blockContent to plain text for contexts that can't render rich text (.ics descriptions, meta tags). */
export function toPlainText(blocks?: PortableTextBlock[]): string | undefined {
  if (!blocks || blocks.length === 0) return undefined;
  const text = blocks
    .map((block) =>
      Array.isArray(block.children)
        ? block.children.map((child) => child.text ?? "").join("")
        : "",
    )
    .filter(Boolean)
    .join("\n");
  return text || undefined;
}
