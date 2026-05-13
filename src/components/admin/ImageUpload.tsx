import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

const BUCKET = "event-assets";

function rand() {
  return Math.random().toString(36).slice(2, 10);
}

export function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  accept = "image/*",
  className,
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  folder?: string;
  accept?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File) => {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "bin";
      const path = `${folder}/${Date.now()}-${rand()}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: file.type || undefined,
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Đã tải ảnh lên");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Tải ảnh thất bại");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <div className="flex items-center gap-2">
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder="https://… hoặc tải ảnh lên"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            <X className="h-4 w-4" />
          </Button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
      {value && (
        <div className="rounded-md border bg-muted/30 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="preview"
            className="max-h-32 rounded object-contain"
            onError={(e) => ((e.currentTarget.style.display = "none"))}
          />
        </div>
      )}
    </div>
  );
}
