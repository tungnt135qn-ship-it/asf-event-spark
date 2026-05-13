import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Eraser,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  compact?: boolean;
};

function Tb({
  active,
  onClick,
  disabled,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-8 w-8 inline-flex items-center justify-center rounded text-xs hover:bg-accent",
        active && "bg-accent text-accent-foreground",
        disabled && "opacity-40 cursor-not-allowed",
      )}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor, compact }: { editor: Editor; compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-1 py-1">
      <Tb title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-3.5 w-3.5" />
      </Tb>
      <Tb title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-3.5 w-3.5" />
      </Tb>
      <Tb title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon className="h-3.5 w-3.5" />
      </Tb>
      {!compact && (
        <>
          <span className="mx-1 h-4 w-px bg-border" />
          <Tb title="H2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 className="h-3.5 w-3.5" />
          </Tb>
          <Tb title="H3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <Heading3 className="h-3.5 w-3.5" />
          </Tb>
          <Tb title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List className="h-3.5 w-3.5" />
          </Tb>
          <Tb title="Ordered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="h-3.5 w-3.5" />
          </Tb>
          <Tb title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Quote className="h-3.5 w-3.5" />
          </Tb>
        </>
      )}
      <span className="mx-1 h-4 w-px bg-border" />
      <Tb
        title="Link"
        active={editor.isActive("link")}
        onClick={() => {
          const prev = editor.getAttributes("link").href as string | undefined;
          const url = window.prompt("URL", prev ?? "https://");
          if (url === null) return;
          if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
          }
          editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }}
      >
        <LinkIcon className="h-3.5 w-3.5" />
      </Tb>
      {!compact && (
        <Tb
          title="Image URL"
          onClick={() => {
            const url = window.prompt("Image URL", "https://");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          <ImageIcon className="h-3.5 w-3.5" />
        </Tb>
      )}
      <span className="mx-1 h-4 w-px bg-border" />
      <Tb title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo className="h-3.5 w-3.5" />
      </Tb>
      <Tb title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo className="h-3.5 w-3.5" />
      </Tb>
      <Tb title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
        <Eraser className="h-3.5 w-3.5" />
      </Tb>
    </div>
  );
}

export function RichTextEditor({ value, onChange, placeholder, minHeight = 140, compact }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
      Image,
      Placeholder.configure({ placeholder: placeholder ?? "Nhập nội dung…" }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: cn(
          "prose-admin focus:outline-none px-3 py-2 text-sm max-w-none",
        ),
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // tiptap empty doc → "<p></p>"; treat as empty string
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  // Sync external value changes (e.g. switching item in a list)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const incoming = value || "";
    const normalized = current === "<p></p>" ? "" : current;
    if (incoming !== normalized) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) {
    return <div className="rounded-md border bg-background" style={{ minHeight }} />;
  }

  return (
    <div className="rounded-md border bg-background overflow-hidden">
      <Toolbar editor={editor} compact={compact} />
      <EditorContent editor={editor} />
    </div>
  );
}

export function RichTextI18nField({
  label,
  value,
  onChange,
  placeholder,
  minHeight,
  compact,
}: {
  label: string;
  value: { vi: string; en: string };
  onChange: (v: { vi: string; en: string }) => void;
  placeholder?: string;
  minHeight?: number;
  compact?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <div className="text-[11px] uppercase text-muted-foreground mb-1">Tiếng Việt</div>
          <RichTextEditor
            value={value?.vi ?? ""}
            onChange={(html) => onChange({ ...value, vi: html })}
            placeholder={placeholder}
            minHeight={minHeight}
            compact={compact}
          />
        </div>
        <div>
          <div className="text-[11px] uppercase text-muted-foreground mb-1">English</div>
          <RichTextEditor
            value={value?.en ?? ""}
            onChange={(html) => onChange({ ...value, en: html })}
            placeholder={placeholder}
            minHeight={minHeight}
            compact={compact}
          />
        </div>
      </div>
    </div>
  );
}
