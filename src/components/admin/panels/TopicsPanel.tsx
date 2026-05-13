import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useAdminAuth } from "@/lib/admin-auth";
import { getEventModulesAdmin } from "@/lib/event-modules-admin.functions";
import { upsertTopic, deleteTopic } from "@/lib/event-items-admin.functions";
import { CrudListPage, CrudColumn } from "@/components/admin/CrudListPage";
import { FormDialog, I18n, I18nField, ReadonlyI18n, emptyI18n } from "@/components/admin/panels/_shared";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TopicRow = {
  id: string;
  slug: string;
  abbr: string | null;
  image_url: string | null;
  title: I18n;
  summary: I18n;
  long_description: I18n;
};
type Mode = "create" | "edit" | "view";
const empty: TopicRow = {
  id: "",
  slug: "",
  abbr: null,
  image_url: null,
  title: { ...emptyI18n },
  summary: { ...emptyI18n },
  long_description: { ...emptyI18n },
};

export function TopicsPanel({ eventId }: { eventId: string }) {
  const { session } = useAdminAuth();
  const fetchAll = useServerFn(getEventModulesAdmin);
  const upsertFn = useServerFn(upsertTopic);
  const deleteFn = useServerFn(deleteTopic);
  const auth = () => ({ Authorization: `Bearer ${session?.access_token}` });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-event-modules", eventId],
    queryFn: () => fetchAll({ data: { event_id: eventId }, headers: auth() }),
    enabled: Boolean(session?.access_token),
  });

  const rows = useMemo<TopicRow[]>(
    () =>
      ((data?.topics ?? []) as Record<string, unknown>[]).map((r) => ({
        id: r.id as string,
        slug: (r.slug as string) ?? "",
        abbr: (r.abbr as string) ?? null,
        image_url: (r.image_url as string) ?? null,
        title: (r.title as I18n) ?? emptyI18n,
        summary: (r.summary as I18n) ?? emptyI18n,
        long_description: (r.long_description as I18n) ?? emptyI18n,
      })),
    [data]
  );

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [form, setForm] = useState<TopicRow>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!open) setForm(empty); }, [open]);

  const submit = async () => {
    if (!form.slug.trim() || !form.title.vi.trim()) {
      toast.error("Slug và Tiêu đề (VI) bắt buộc");
      return;
    }
    setSaving(true);
    try {
      await upsertFn({
        data: {
          id: mode === "edit" && form.id ? form.id : undefined,
          event_id: eventId,
          slug: form.slug.trim(),
          abbr: form.abbr,
          image_url: form.image_url,
          title: form.title,
          summary: form.summary,
          long_description: form.long_description,
        },
        headers: auth(),
      });
      toast.success(mode === "edit" ? "Đã cập nhật" : "Đã tạo chủ đề");
      setOpen(false);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r: TopicRow) => {
    try {
      await deleteFn({ data: { id: r.id, event_id: eventId }, headers: auth() });
      toast.success("Đã xoá");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    }
  };

  const columns: CrudColumn<TopicRow>[] = [
    {
      key: "title",
      header: "Chủ đề",
      render: (r) => (
        <div className="min-w-0">
          <div className="font-medium truncate">{r.title.vi || r.title.en || r.slug}</div>
          <div className="text-xs text-muted-foreground truncate">/{r.slug}</div>
        </div>
      ),
    },
    { key: "abbr", header: "Mã", render: (r) => r.abbr || "—" },
    { key: "summary", header: "Tóm tắt", render: (r) => <div className="truncate max-w-md text-sm text-muted-foreground">{r.summary.vi || r.summary.en || "—"}</div> },
  ];

  return (
    <>
      <CrudListPage<TopicRow>
        title="Chủ đề"
        description="Các chủ đề của sự kiện"
        loading={isLoading}
        rows={rows}
        columns={columns}
        searchAccessor={(r) => `${r.slug} ${r.title.vi} ${r.title.en} ${r.abbr ?? ""}`}
        onCreate={() => { setMode("create"); setForm(empty); setOpen(true); }}
        onView={(r) => { setMode("view"); setForm(r); setOpen(true); }}
        onEdit={(r) => { setMode("edit"); setForm(r); setOpen(true); }}
        onDelete={remove}
      />
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={mode === "create" ? "Tạo chủ đề" : mode === "edit" ? "Sửa chủ đề" : "Xem chủ đề"}
        readOnly={mode === "view"}
        saving={saving}
        onSubmit={submit}
        size="xl"
      >
        {mode === "view" ? (
          <>
            <div className="text-sm"><strong>Slug:</strong> {form.slug} {form.abbr && <>· <strong>Mã:</strong> {form.abbr}</>}</div>
            {form.image_url && <img src={form.image_url} alt="" className="rounded border max-h-60 object-cover" />}
            <ReadonlyI18n label="Tiêu đề" value={form.title} />
            <ReadonlyI18n label="Tóm tắt" value={form.summary} rich />
            <ReadonlyI18n label="Mô tả chi tiết" value={form.long_description} rich />
          </>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Slug *</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Mã viết tắt</Label>
                <Input value={form.abbr ?? ""} onChange={(e) => setForm({ ...form, abbr: e.target.value || null })} />
              </div>
              <div className="md:col-span-1">
                <Label className="text-xs">Ảnh</Label>
                <ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="topics" />
              </div>
            </div>
            <I18nField label="Tiêu đề *" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            <I18nField label="Tóm tắt" value={form.summary} rich onChange={(v) => setForm({ ...form, summary: v })} />
            <I18nField label="Mô tả chi tiết" value={form.long_description} rich onChange={(v) => setForm({ ...form, long_description: v })} />
          </>
        )}
      </FormDialog>
    </>
  );
}
