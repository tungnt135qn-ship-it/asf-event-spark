import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useAdminAuth } from "@/lib/admin-auth";
import { getEventResourcesAdmin } from "@/lib/event-resources-admin.functions";
import { upsertLibraryItem, deleteLibraryItem } from "@/lib/event-items-admin.functions";
import { CrudListPage, CrudColumn } from "@/components/admin/CrudListPage";
import { FormDialog, I18n, I18nField, ReadonlyI18n, emptyI18n } from "@/components/admin/panels/_shared";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type LibRow = {
  id: string;
  external_id: string | null;
  type: "photo" | "video";
  day_index: number | null;
  title: I18n;
  thumbnail_url: string;
  source_url: string;
  requires_code: boolean;
};
type Mode = "create" | "edit" | "view";
const empty: LibRow = {
  id: "",
  external_id: null,
  type: "photo",
  day_index: null,
  title: { ...emptyI18n },
  thumbnail_url: "",
  source_url: "",
  requires_code: false,
};

export function LibraryPanel({ eventId }: { eventId: string }) {
  const { session } = useAdminAuth();
  const fetchAll = useServerFn(getEventResourcesAdmin);
  const upsertFn = useServerFn(upsertLibraryItem);
  const deleteFn = useServerFn(deleteLibraryItem);
  const auth = () => ({ Authorization: `Bearer ${session?.access_token}` });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-event-resources", eventId],
    queryFn: () => fetchAll({ data: { event_id: eventId }, headers: auth() }),
    enabled: Boolean(session?.access_token),
  });

  const rows = useMemo<LibRow[]>(
    () =>
      ((data?.library_items ?? []) as Record<string, unknown>[]).map((r) => ({
        id: r.id as string,
        external_id: (r.external_id as string) ?? null,
        type: (r.type as "photo" | "video") ?? "photo",
        day_index: (r.day_index as number) ?? null,
        title: (r.title as I18n) ?? emptyI18n,
        thumbnail_url: (r.thumbnail_url as string) ?? "",
        source_url: (r.source_url as string) ?? "",
        requires_code: Boolean(r.requires_code),
      })),
    [data]
  );

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [form, setForm] = useState<LibRow>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!open) setForm(empty); }, [open]);

  const submit = async () => {
    if (!form.thumbnail_url.trim() || !form.source_url.trim()) {
      toast.error("Thumbnail và Source URL bắt buộc");
      return;
    }
    setSaving(true);
    try {
      await upsertFn({
        data: {
          id: mode === "edit" && form.id ? form.id : undefined,
          event_id: eventId,
          external_id: form.external_id,
          type: form.type,
          day_index: form.day_index,
          title: form.title,
          thumbnail_url: form.thumbnail_url,
          source_url: form.source_url,
          requires_code: form.requires_code,
        },
        headers: auth(),
      });
      toast.success(mode === "edit" ? "Đã cập nhật" : "Đã thêm");
      setOpen(false);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r: LibRow) => {
    try {
      await deleteFn({ data: { id: r.id, event_id: eventId }, headers: auth() });
      toast.success("Đã xoá");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    }
  };

  const columns: CrudColumn<LibRow>[] = [
    {
      key: "thumb",
      header: "",
      className: "w-[64px]",
      render: (r) =>
        r.thumbnail_url ? (
          <img src={r.thumbnail_url} alt="" className="h-10 w-14 object-cover rounded" />
        ) : <div className="h-10 w-14 bg-muted rounded" />,
    },
    { key: "title", header: "Tiêu đề", render: (r) => <div className="font-medium truncate">{r.title.vi || r.title.en || "—"}</div> },
    { key: "type", header: "Loại", render: (r) => <Badge variant="outline">{r.type}</Badge> },
    { key: "day", header: "Ngày", render: (r) => (r.day_index ?? "—") },
    { key: "lock", header: "Bảo vệ", render: (r) => (r.requires_code ? <Badge variant="secondary">Cần mã</Badge> : <span className="text-muted-foreground">—</span>) },
  ];

  return (
    <>
      <CrudListPage<LibRow>
        title="Thư viện"
        description="Ảnh và video sự kiện"
        loading={isLoading}
        rows={rows}
        columns={columns}
        searchAccessor={(r) => `${r.title.vi} ${r.title.en} ${r.type}`}
        onCreate={() => { setMode("create"); setForm(empty); setOpen(true); }}
        onView={(r) => { setMode("view"); setForm(r); setOpen(true); }}
        onEdit={(r) => { setMode("edit"); setForm(r); setOpen(true); }}
        onDelete={remove}
      />
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={mode === "create" ? "Thêm media" : mode === "edit" ? "Sửa media" : "Xem media"}
        readOnly={mode === "view"}
        saving={saving}
        onSubmit={submit}
      >
        {mode === "view" ? (
          <>
            <ReadonlyI18n label="Tiêu đề" value={form.title} />
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>Loại: <Badge>{form.type}</Badge></div>
              <div>Ngày: {form.day_index ?? "—"}</div>
            </div>
            {form.thumbnail_url && <img src={form.thumbnail_url} alt="" className="rounded border max-h-60 object-cover" />}
            {form.source_url && <a className="text-primary hover:underline text-sm" href={form.source_url} target="_blank" rel="noreferrer">{form.source_url}</a>}
          </>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Loại</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as "photo" | "video" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photo">Ảnh</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Ngày (1, 2…)</Label>
                <Input
                  type="number"
                  value={form.day_index ?? ""}
                  onChange={(e) => setForm({ ...form, day_index: e.target.value ? Number(e.target.value) : null })}
                />
              </div>
              <div>
                <Label className="text-xs">External ID</Label>
                <Input value={form.external_id ?? ""} onChange={(e) => setForm({ ...form, external_id: e.target.value || null })} />
              </div>
            </div>
            <I18nField label="Tiêu đề" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            <div>
              <Label className="text-xs">Thumbnail *</Label>
              <ImageUpload value={form.thumbnail_url} onChange={(url) => setForm({ ...form, thumbnail_url: url ?? "" })} folder="library" />
            </div>
            <div>
              <Label className="text-xs">Source URL * (ảnh full-size hoặc link video)</Label>
              <Input value={form.source_url} onChange={(e) => setForm({ ...form, source_url: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.requires_code} onCheckedChange={(v) => setForm({ ...form, requires_code: v })} />
              <Label className="text-xs">Yêu cầu access code</Label>
            </div>
          </>
        )}
      </FormDialog>
    </>
  );
}
