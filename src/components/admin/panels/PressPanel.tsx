import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useAdminAuth } from "@/lib/admin-auth";
import { getEventResourcesAdmin } from "@/lib/event-resources-admin.functions";
import { upsertPressRelease, deletePressRelease } from "@/lib/event-items-admin.functions";
import { CrudListPage, CrudColumn } from "@/components/admin/CrudListPage";
import { FormDialog, I18n, I18nField, ReadonlyI18n, emptyI18n } from "@/components/admin/panels/_shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PressRow = {
  id: string;
  title: I18n;
  description: I18n;
  source: string | null;
  url: string | null;
  file_url: string | null;
  published_at: string | null;
};
type Mode = "create" | "edit" | "view";
const empty: PressRow = {
  id: "",
  title: { ...emptyI18n },
  description: { ...emptyI18n },
  source: null,
  url: null,
  file_url: null,
  published_at: null,
};

export function PressPanel({ eventId }: { eventId: string }) {
  const { session } = useAdminAuth();
  const fetchAll = useServerFn(getEventResourcesAdmin);
  const upsertFn = useServerFn(upsertPressRelease);
  const deleteFn = useServerFn(deletePressRelease);
  const auth = () => ({ Authorization: `Bearer ${session?.access_token}` });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-event-resources", eventId],
    queryFn: () => fetchAll({ data: { event_id: eventId }, headers: auth() }),
    enabled: Boolean(session?.access_token),
  });

  const rows = useMemo<PressRow[]>(
    () =>
      ((data?.press_releases ?? []) as Record<string, unknown>[]).map((r) => ({
        id: r.id as string,
        title: (r.title as I18n) ?? emptyI18n,
        description: (r.description as I18n) ?? emptyI18n,
        source: (r.source as string) ?? null,
        url: (r.url as string) ?? null,
        file_url: (r.file_url as string) ?? null,
        published_at: (r.published_at as string) ?? null,
      })),
    [data]
  );

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [form, setForm] = useState<PressRow>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!open) setForm(empty); }, [open]);

  const submit = async () => {
    if (!form.title.vi.trim() && !form.title.en.trim()) {
      toast.error("Tiêu đề bắt buộc");
      return;
    }
    setSaving(true);
    try {
      await upsertFn({
        data: {
          id: mode === "edit" && form.id ? form.id : undefined,
          event_id: eventId,
          title: form.title,
          description: form.description,
          source: form.source,
          url: form.url,
          file_url: form.file_url,
          published_at: form.published_at,
        },
        headers: auth(),
      });
      toast.success(mode === "edit" ? "Đã cập nhật" : "Đã tạo");
      setOpen(false);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r: PressRow) => {
    try {
      await deleteFn({ data: { id: r.id, event_id: eventId }, headers: auth() });
      toast.success("Đã xoá");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    }
  };

  const columns: CrudColumn<PressRow>[] = [
    { key: "title", header: "Tiêu đề", render: (r) => <div className="font-medium truncate">{r.title.vi || r.title.en || "—"}</div> },
    { key: "src", header: "Nguồn", render: (r) => r.source || "—" },
    { key: "pub", header: "Ngày", render: (r) => (r.published_at ? new Date(r.published_at).toLocaleDateString() : "—") },
  ];

  return (
    <>
      <CrudListPage<PressRow>
        title="Thông cáo báo chí"
        description="Press releases"
        loading={isLoading}
        rows={rows}
        columns={columns}
        searchAccessor={(r) => `${r.title.vi} ${r.title.en} ${r.source ?? ""}`}
        onCreate={() => { setMode("create"); setForm(empty); setOpen(true); }}
        onView={(r) => { setMode("view"); setForm(r); setOpen(true); }}
        onEdit={(r) => { setMode("edit"); setForm(r); setOpen(true); }}
        onDelete={remove}
      />
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={mode === "create" ? "Tạo thông cáo" : mode === "edit" ? "Sửa thông cáo" : "Xem thông cáo"}
        readOnly={mode === "view"}
        saving={saving}
        onSubmit={submit}
      >
        {mode === "view" ? (
          <>
            <ReadonlyI18n label="Tiêu đề" value={form.title} />
            <ReadonlyI18n label="Mô tả" value={form.description} rich />
            <div className="text-sm space-y-1">
              <div>Nguồn: {form.source || "—"}</div>
              {form.url && <div>URL: <a className="text-primary hover:underline" href={form.url} target="_blank" rel="noreferrer">{form.url}</a></div>}
              {form.file_url && <div>File: <a className="text-primary hover:underline" href={form.file_url} target="_blank" rel="noreferrer">{form.file_url}</a></div>}
              {form.published_at && <div>Đăng: {new Date(form.published_at).toLocaleString()}</div>}
            </div>
          </>
        ) : (
          <>
            <I18nField label="Tiêu đề *" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            <I18nField label="Mô tả" value={form.description} rich onChange={(v) => setForm({ ...form, description: v })} />
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Nguồn</Label>
                <Input value={form.source ?? ""} onChange={(e) => setForm({ ...form, source: e.target.value || null })} />
              </div>
              <div>
                <Label className="text-xs">Ngày đăng</Label>
                <Input
                  type="datetime-local"
                  value={form.published_at ? new Date(form.published_at).toISOString().slice(0, 16) : ""}
                  onChange={(e) => setForm({ ...form, published_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">URL bài viết</Label>
              <Input value={form.url ?? ""} onChange={(e) => setForm({ ...form, url: e.target.value || null })} />
            </div>
            <div>
              <Label className="text-xs">URL file (PDF…)</Label>
              <Input value={form.file_url ?? ""} onChange={(e) => setForm({ ...form, file_url: e.target.value || null })} />
            </div>
          </>
        )}
      </FormDialog>
    </>
  );
}
