import { cn } from "@/lib/utils";

/**
 * Renders HTML content from the rich-text editor.
 * Falls back gracefully when the value is plain text (no tags).
 */
export function RichHtml({
  html,
  className,
  as: Tag = "div",
}: {
  html?: string | null;
  className?: string;
  as?: "div" | "p" | "span";
}) {
  if (!html) return null;
  const looksLikeHtml = /<[a-z][\s\S]*>/i.test(html);
  if (!looksLikeHtml) {
    return <Tag className={className}>{html}</Tag>;
  }
  return (
    <Tag
      className={cn("prose-content", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
