import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useAdminAuth } from "@/lib/admin-auth";
import { getEventResourcesAdmin } from "@/lib/event-resources-admin.functions";
import { upsertDocument, deleteDocument } from "@/lib/event-items-admin.functions";
import { CrudListPage, CrudColumn } from "@/components/admin/CrudListPage";
import { FormDialog, I18n, I18nField, ReadonlyI18n, emptyI18n } from "@/components/admin/panels/_shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

type DocRow = {
  id: string;
  name: I18n;
  description: I18n;
  file_url: string | null;
  file_type: string | null;
  file_size: string | null;
  requires_code: boolean;
};
type Mode = "create" | "edit" | "view";
const empty: DocRow = {
  id: "",
  name: { ...emptyI18n },
  description: { ...emptyI18n },
  file_url: null,
  file_type: null,
  file_size: null,
  requires_code: false,
};

export function DocumentsPanel({ eventId }: { eventId: string }) {
  const { session } = useAdminAuth();
  const fetchAll = useServerFn(getEventResourcesAdmin);
  const upsertFn = useServerFn(upsertDocument);
  const deleteFn = useServerFn(deleteDocument);
  const auth = () => ({ Authorization: `Bearer ${session?.access_token}` });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-event-resources", eventId],
    queryFn: () => fetchAll({ data: { event_id: eventId }, headers: auth() }),
    enabled: Boolean(session?.access_token),
  });

  const rows = useMemo<DocRow[]>(
    () =>
      ((data?.documents ?? []) as Record<string, unknown>[]).map((r) => ({
        id: r.id as string,
        name: (r.name as I18n) ?? emptyI18n,
        description: (r.description as I18n) ?? emptyI18n,
        file_url: (r.file_url as string) ?? null,
        file_type: (r.file_type as string) ?? null,
        file_size: (r.file_size as string) ?? null,
        requires_code: Boolean(r.requires_code),
      })),
    [data]
  );

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [form, setForm] = useState<DocRow>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!open) setForm(empty); }, [open]);

  const submit = async () => {
    if (!form.name.vi.trim() && !form.name.en.trim()) {
      toast.error("Tên tài liệu bắt buộc");
      return;
    }
    setSaving(true);
    try {
      await upsertFn({
        data: {
          id: mode === "edit" && form.id ? form.id : undefined,
          event_id: eventId,
          name: form.name,
          description: form.description,
          file_url: form.file_url,
          file_type: form.file_type,
          file_size: form.file_size,
          requires_code: form.requires_code,
        },
        headers: auth(),
      });
      toast.success(mode === "edit" ? "Đã cập nhật" : "Đã tạo tài liệu");
      setOpen(false);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r: DocRow) => {
    try {
      await deleteFn({ data: { id: r.id, event_id: eventId }, headers: auth() });
      toast.success("Đã xoá");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    }
  };

  const columns: CrudColumn<DocRow>[] = [
    { key: "name", header: "Tên", render: (r) => <div className="font-medium truncate">{r.name.vi || r.name.en || "—"}</div> },
    { key: "type", header: "Loại", render: (r) => r.file_type || "—" },
    { key: "size", header: "Kích thước", render: (r) => r.file_size || "—" },
    { key: "lock", header: "Bảo vệ", render: (r) => (r.requires_code ? <Badge variant="secondary">Cần mã</Badge> : <span className="text-muted-foreground">—</span>) },
  ];

  return (
    <>
      <CrudListPage<DocRow>
        title="Tài liệu"
        description="Quản lý tài liệu sự kiện (PDF, DOC, …)"
        loading={isLoading}
        rows={rows}
        columns={columns}
        searchAccessor={(r) => `${r.name.vi} ${r.name.en} ${r.file_type ?? ""}`}
        onCreate={() => { setMode("create"); setForm(empty); setOpen(true); }}
        onView={(r) => { setMode("view"); setForm(r); setOpen(true); }}
        onEdit={(r) => { setMode("edit"); setForm(r); setOpen(true); }}
        onDelete={remove}
      />
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={mode === "create" ? "Tạo tài liệu" : mode === "edit" ? "Sửa tài liệu" : "Xem tài liệu"}
        readOnly={mode === "view"}
        saving={saving}
        onSubmit={submit}
      >
        {mode === "view" ? (
          <>
            <ReadonlyI18n label="Tên" value={form.name} />
            <ReadonlyI18n label="Mô tả" value={form.description} rich />
            <div className="text-sm space-y-1">
              <div>Loại: {form.file_type || "—"} · Kích thước: {form.file_size || "—"}</div>
              {form.file_url && <a className="text-primary hover:underline" href={form.file_url} target="_blank" rel="noreferrer">{form.file_url}</a>}
              <div>{form.requires_code ? "Yêu cầu access code" : "Công khai"}</div>
            </div>
          </>
        ) : (
          <>
            <I18nField label="Tên *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <I18nField label="Mô tả" value={form.description} rich onChange={(v) => setForm({ ...form, description: v })} />
            <div>
              <Label className="text-xs">URL file</Label>
              <Input value={form.file_url ?? ""} placeholder="https://…" onChange={(e) => setForm({ ...form, file_url: e.target.value || null })} />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Loại (PDF, DOCX…)</Label>
                <Input value={form.file_type ?? ""} onChange={(e) => setForm({ ...form, file_type: e.target.value || null })} />
              </div>
              <div>
                <Label className="text-xs">Kích thước (vd: 2.4 MB)</Label>
                <Input value={form.file_size ?? ""} onChange={(e) => setForm({ ...form, file_size: e.target.value || null })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.requires_code} onCheckedChange={(v) => setForm({ ...form, requires_code: v })} />
              <Label className="text-xs">Yêu cầu access code để tải</Label>
            </div>
          </>
        )}
      </FormDialog>
    </>
  );
}
