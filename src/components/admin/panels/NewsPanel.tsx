import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useAdminAuth } from "@/lib/admin-auth";
import { getEventResourcesAdmin } from "@/lib/event-resources-admin.functions";
import { upsertNewsItem, deleteNewsItem } from "@/lib/event-items-admin.functions";
import { CrudListPage, CrudColumn } from "@/components/admin/CrudListPage";
import { FormDialog, I18n, I18nField, ReadonlyI18n, emptyI18n } from "@/components/admin/panels/_shared";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type NewsRow = {
  id: string;
  slug: string;
  tag: string | null;
  title: I18n;
  excerpt: I18n;
  body: { vi: string[]; en: string[] };
  cover_url: string | null;
  author: string | null;
  read_time: string | null;
  published_at: string | null;
};

type Mode = "create" | "edit" | "view";

const empty: NewsRow = {
  id: "",
  slug: "",
  tag: null,
  title: { ...emptyI18n },
  excerpt: { ...emptyI18n },
  body: { vi: [], en: [] },
  cover_url: null,
  author: null,
  read_time: null,
  published_at: null,
};

export function NewsPanel({ eventId }: { eventId: string }) {
  const { session } = useAdminAuth();
  const qc = useQueryClient();
  const fetchAll = useServerFn(getEventResourcesAdmin);
  const upsertFn = useServerFn(upsertNewsItem);
  const deleteFn = useServerFn(deleteNewsItem);

  const auth = () => ({ Authorization: `Bearer ${session?.access_token}` });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-event-resources", eventId],
    queryFn: () => fetchAll({ data: { event_id: eventId }, headers: auth() }),
    enabled: Boolean(session?.access_token),
  });

  const rows = useMemo<NewsRow[]>(
    () =>
      ((data?.news ?? []) as Record<string, unknown>[]).map((n) => ({
        id: n.id as string,
        slug: (n.slug as string) ?? "",
        tag: (n.tag as string) ?? null,
        title: (n.title as I18n) ?? emptyI18n,
        excerpt: (n.excerpt as I18n) ?? emptyI18n,
        body: (n.body as { vi: string[]; en: string[] }) ?? { vi: [], en: [] },
        cover_url: (n.cover_url as string) ?? null,
        author: (n.author as string) ?? null,
        read_time: (n.read_time as string) ?? null,
        published_at: (n.published_at as string) ?? null,
      })),
    [data]
  );

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [form, setForm] = useState<NewsRow>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) setForm(empty);
  }, [open]);

  const openCreate = () => {
    setMode("create");
    setForm({ ...empty, body: { vi: [], en: [] } });
    setOpen(true);
  };
  const openEdit = (r: NewsRow) => {
    setMode("edit");
    setForm(r);
    setOpen(true);
  };
  const openView = (r: NewsRow) => {
    setMode("view");
    setForm(r);
    setOpen(true);
  };

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
          tag: form.tag,
          title: form.title,
          excerpt: form.excerpt,
          body: form.body,
          cover_url: form.cover_url,
          author: form.author,
          read_time: form.read_time,
          published_at: form.published_at,
        },
        headers: auth(),
      });
      toast.success(mode === "edit" ? "Đã cập nhật" : "Đã tạo bài viết");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["admin-event-resources", eventId] });
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r: NewsRow) => {
    try {
      await deleteFn({ data: { id: r.id, event_id: eventId }, headers: auth() });
      toast.success("Đã xoá");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    }
  };

  const columns: CrudColumn<NewsRow>[] = [
    {
      key: "title",
      header: "Tiêu đề",
      render: (r) => (
        <div className="min-w-0">
          <div className="font-medium truncate">{r.title.vi || r.title.en || r.slug}</div>
          <div className="text-xs text-muted-foreground truncate">/{r.slug}</div>
        </div>
      ),
    },
    {
      key: "tag",
      header: "Tag",
      render: (r) => (r.tag ? <Badge variant="secondary">{r.tag}</Badge> : <span className="text-muted-foreground">—</span>),
    },
    { key: "author", header: "Tác giả", render: (r) => r.author || "—" },
    {
      key: "published_at",
      header: "Đăng",
      render: (r) => (r.published_at ? new Date(r.published_at).toLocaleDateString() : "—"),
    },
  ];

  return (
    <>
      <CrudListPage<NewsRow>
        title="Tin tức"
        description="Quản lý các bài viết tin tức của sự kiện"
        loading={isLoading}
        rows={rows}
        columns={columns}
        searchAccessor={(r) => `${r.slug} ${r.title.vi} ${r.title.en} ${r.tag ?? ""}`}
        onCreate={openCreate}
        onView={openView}
        onEdit={openEdit}
        onDelete={remove}
        emptyText="Chưa có bài viết nào."
      />

      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={mode === "create" ? "Tạo bài viết" : mode === "edit" ? "Sửa bài viết" : "Xem bài viết"}
        readOnly={mode === "view"}
        saving={saving}
        onSubmit={submit}
        size="xl"
      >
        {mode === "view" ? (
          <div className="space-y-4">
            <div className="text-sm">
              <strong>Slug:</strong> {form.slug} {form.tag && <Badge className="ml-2">{form.tag}</Badge>}
            </div>
            {form.cover_url && (
              <img src={form.cover_url} alt="" className="rounded border max-h-60 object-cover" />
            )}
            <ReadonlyI18n label="Tiêu đề" value={form.title} />
            <ReadonlyI18n label="Mô tả ngắn" value={form.excerpt} rich />
            <div className="grid md:grid-cols-2 gap-3">
              <div className="rounded border p-2 bg-muted/30">
                <div className="text-[10px] text-muted-foreground mb-1">Nội dung VI</div>
                {form.body.vi.map((p, i) => <p key={i} className="text-sm mb-2">{p}</p>)}
              </div>
              <div className="rounded border p-2 bg-muted/30">
                <div className="text-[10px] text-muted-foreground mb-1">Nội dung EN</div>
                {form.body.en.map((p, i) => <p key={i} className="text-sm mb-2">{p}</p>)}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {form.author && <>Tác giả: {form.author} · </>}
              {form.read_time && <>{form.read_time} · </>}
              {form.published_at && <>Đăng: {new Date(form.published_at).toLocaleString()}</>}
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Slug *</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Tag</Label>
                <Input value={form.tag ?? ""} onChange={(e) => setForm({ ...form, tag: e.target.value || null })} />
              </div>
              <div>
                <Label className="text-xs">Tác giả</Label>
                <Input value={form.author ?? ""} onChange={(e) => setForm({ ...form, author: e.target.value || null })} />
              </div>
            </div>
            <I18nField label="Tiêu đề" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            <I18nField label="Mô tả ngắn" value={form.excerpt} rich onChange={(v) => setForm({ ...form, excerpt: v })} />
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Nội dung VI (mỗi dòng 1 đoạn)</Label>
                <Textarea
                  rows={6}
                  value={form.body.vi.join("\n")}
                  onChange={(e) =>
                    setForm({ ...form, body: { ...form.body, vi: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) } })
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Nội dung EN (mỗi dòng 1 đoạn)</Label>
                <Textarea
                  rows={6}
                  value={form.body.en.join("\n")}
                  onChange={(e) =>
                    setForm({ ...form, body: { ...form.body, en: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) } })
                  }
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <Label className="text-xs">Ảnh bìa</Label>
                <ImageUpload value={form.cover_url} onChange={(url) => setForm({ ...form, cover_url: url })} folder="news" />
              </div>
              <div>
                <Label className="text-xs">Read time</Label>
                <Input value={form.read_time ?? ""} placeholder="5 min" onChange={(e) => setForm({ ...form, read_time: e.target.value || null })} />
              </div>
              <div className="md:col-span-3">
                <Label className="text-xs">Ngày đăng</Label>
                <Input
                  type="datetime-local"
                  value={form.published_at ? new Date(form.published_at).toISOString().slice(0, 16) : ""}
                  onChange={(e) =>
                    setForm({ ...form, published_at: e.target.value ? new Date(e.target.value).toISOString() : null })
                  }
                />
              </div>
            </div>
          </>
        )}
      </FormDialog>
    </>
  );
}
