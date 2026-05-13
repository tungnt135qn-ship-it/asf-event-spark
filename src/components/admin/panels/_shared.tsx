// Reusable bits for panel dialogs
import { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextI18nField } from "@/components/admin/RichTextEditor";
import { RichHtml } from "@/components/ui/RichHtml";

export type I18n = { vi: string; en: string };
export const emptyI18n: I18n = { vi: "", en: "" };

export function I18nField({
  label,
  value,
  onChange,
  textarea,
  rich,
}: {
  label: string;
  value: I18n;
  onChange: (v: I18n) => void;
  textarea?: boolean;
  rich?: boolean;
}) {
  if (rich) return <RichTextI18nField label={label} value={value} onChange={onChange} />;
  const Field = textarea ? Textarea : Input;
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="grid md:grid-cols-2 gap-2">
        <Field
          placeholder="VI"
          value={value?.vi ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            onChange({ ...value, vi: e.target.value })
          }
        />
        <Field
          placeholder="EN"
          value={value?.en ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            onChange({ ...value, en: e.target.value })
          }
        />
      </div>
    </div>
  );
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  saving,
  readOnly,
  size = "lg",
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit?: () => void | Promise<void>;
  saving?: boolean;
  readOnly?: boolean;
  size?: "md" | "lg" | "xl";
}) {
  const widthClass = size === "xl" ? "max-w-5xl" : size === "lg" ? "max-w-3xl" : "max-w-xl";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${widthClass} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-4 py-2">{children}</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {readOnly ? "Đóng" : "Huỷ"}
          </Button>
          {!readOnly && onSubmit && (
            <Button onClick={onSubmit} disabled={saving}>
              {saving ? "Đang lưu…" : "Lưu"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ReadonlyI18n({ label, value, rich }: { label: string; value: I18n; rich?: boolean }) {
  return (
    <div className="space-y-1">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="grid md:grid-cols-2 gap-3 text-sm">
        <div className="rounded border p-2 bg-muted/30">
          <div className="text-[10px] text-muted-foreground mb-1">VI</div>
          {rich ? <RichHtml html={value?.vi ?? ""} /> : <div className="whitespace-pre-wrap">{value?.vi || "—"}</div>}
        </div>
        <div className="rounded border p-2 bg-muted/30">
          <div className="text-[10px] text-muted-foreground mb-1">EN</div>
          {rich ? <RichHtml html={value?.en ?? ""} /> : <div className="whitespace-pre-wrap">{value?.en || "—"}</div>}
        </div>
      </div>
    </div>
  );
}
