import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  getEventResourcesAdmin,
  replaceHotels,
  replaceNews,
  replaceDocuments,
  replaceLibrary,
  replacePressReleases,
  replaceAccessCodes,
} from "@/lib/event-resources-admin.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Save, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";

type I18n = { vi: string; en: string };
type I18nList = { vi: string[]; en: string[] };
const emptyI18n: I18n = { vi: "", en: "" };
const emptyI18nList: I18nList = { vi: [], en: [] };

import { RichTextI18nField } from "@/components/admin/RichTextEditor";

function I18nField({
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
  if (rich) {
    return <RichTextI18nField label={label} value={value} onChange={onChange} />;
  }
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

function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const out = [...arr];
  [out[i], out[j]] = [out[j], out[i]];
  return out;
}

function toLines(s: string): string[] {
  return s.split("\n").map((x) => x.trim()).filter(Boolean);
}

export function ResourcesTab({ eventId }: { eventId: string }) {
  const { session } = useAdminAuth();
  const fetchAll = useServerFn(getEventResourcesAdmin);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-event-resources", eventId],
    queryFn: async () => {
      const t = session?.access_token;
      if (!t) throw new Error("Phiên đăng nhập không hợp lệ");
      return fetchAll({
        data: { event_id: eventId },
        headers: { Authorization: `Bearer ${t}` },
      });
    },
    enabled: Boolean(session?.access_token),
  });

  if (isLoading) return <div className="text-sm text-muted-foreground p-4">Đang tải…</div>;
  if (!data) return null;

  return (
    <Tabs defaultValue="hotels" className="w-full">
      <TabsList className="flex-wrap h-auto">
        <TabsTrigger value="hotels">Khách sạn</TabsTrigger>
        <TabsTrigger value="news">Tin tức</TabsTrigger>
        <TabsTrigger value="documents">Tài liệu</TabsTrigger>
        <TabsTrigger value="library">Thư viện</TabsTrigger>
        <TabsTrigger value="press">Thông cáo</TabsTrigger>
        <TabsTrigger value="codes">Access codes</TabsTrigger>
      </TabsList>

      <TabsContent value="hotels" className="mt-4">
        <HotelsEditor eventId={eventId} initial={data.hotels as never[]} onSaved={refetch} />
      </TabsContent>
      <TabsContent value="news" className="mt-4">
        <NewsEditor eventId={eventId} initial={data.news as never[]} onSaved={refetch} />
      </TabsContent>
      <TabsContent value="documents" className="mt-4">
        <DocumentsEditor eventId={eventId} initial={data.documents as never[]} onSaved={refetch} />
      </TabsContent>
      <TabsContent value="library" className="mt-4">
        <LibraryEditor eventId={eventId} initial={data.library_items as never[]} onSaved={refetch} />
      </TabsContent>
      <TabsContent value="press" className="mt-4">
        <PressEditor eventId={eventId} initial={data.press_releases as never[]} onSaved={refetch} />
      </TabsContent>
      <TabsContent value="codes" className="mt-4">
        <AccessCodesEditor eventId={eventId} initial={data.access_codes as never[]} onSaved={refetch} />
      </TabsContent>
    </Tabs>
  );
}

function ItemHeader({
  title,
  idx,
  total,
  onUp,
  onDown,
  onDelete,
}: {
  title: string;
  idx: number;
  total: number;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="text-sm font-medium">
        #{idx + 1} {title}
      </div>
      <div className="flex items-center gap-1">
        <Button type="button" size="icon" variant="ghost" onClick={onUp} disabled={idx === 0}>
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onDown}
          disabled={idx === total - 1}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function SaveBar({ saving, onAdd, addLabel = "Thêm" }: { saving: boolean; onAdd: () => void; addLabel?: string }) {
  return (
    <div className="flex justify-between gap-2">
      <Button type="button" variant="outline" onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" /> {addLabel}
      </Button>
      <Button type="submit" disabled={saving}>
        <Save className="mr-2 h-4 w-4" />
        {saving ? "Đang lưu…" : "Lưu"}
      </Button>
    </div>
  );
}

// ============ HOTELS ============
type HotelRow = {
  external_id: string | null;
  name: string;
  tier: I18n;
  address: I18n;
  description: I18n;
  perks: I18nList;
  contact: Record<string, string | null>;
  images: string[];
  map_url: string | null;
  website_url: string | null;
};

function HotelsEditor({
  eventId,
  initial,
  onSaved,
}: {
  eventId: string;
  initial: never[];
  onSaved: () => void;
}) {
  const { session } = useAdminAuth();
  const saveFn = useServerFn(replaceHotels);
  const [items, setItems] = useState<HotelRow[]>(
    (initial as unknown as HotelRow[]).map((h) => ({
      external_id: h.external_id ?? null,
      name: h.name ?? "",
      tier: (h.tier as I18n) ?? emptyI18n,
      address: (h.address as I18n) ?? emptyI18n,
      description: (h.description as I18n) ?? emptyI18n,
      perks: (h.perks as I18nList) ?? emptyI18nList,
      contact: (h.contact as Record<string, string | null>) ?? {},
      images: (h.images as string[]) ?? [],
      map_url: h.map_url ?? null,
      website_url: h.website_url ?? null,
    })),
  );
  const [saving, setSaving] = useState(false);
  useEffect(() => {/* eslint-disable-next-line react-hooks/exhaustive-deps */}, [eventId]);

  const update = (i: number, patch: Partial<HotelRow>) =>
    setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = session?.access_token;
    if (!t) return toast.error("Phiên đăng nhập không hợp lệ");
    setSaving(true);
    try {
      await saveFn({
        data: {
          event_id: eventId,
          items: items.map((it, idx) => ({ ...it, position: idx })),
        },
        headers: { Authorization: `Bearer ${t}` },
      });
      toast.success("Đã lưu khách sạn");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={submit} className="space-y-4">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">Chưa có khách sạn.</p>
        )}
        {items.map((h, idx) => (
          <Card key={idx} className="p-4 bg-muted/30">
            <ItemHeader
              title={h.name || "Khách sạn"}
              idx={idx}
              total={items.length}
              onUp={() => setItems(move(items, idx, -1))}
              onDown={() => setItems(move(items, idx, 1))}
              onDelete={() => setItems(items.filter((_, i) => i !== idx))}
            />
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Tên</Label>
                <Input value={h.name} onChange={(e) => update(idx, { name: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">External ID</Label>
                <Input
                  value={h.external_id ?? ""}
                  onChange={(e) => update(idx, { external_id: e.target.value || null })}
                />
              </div>
            </div>
            <div className="mt-3 space-y-3">
              <I18nField label="Hạng" value={h.tier} onChange={(v) => update(idx, { tier: v })} />
              <I18nField label="Địa chỉ" value={h.address} onChange={(v) => update(idx, { address: v })} />
              <I18nField label="Mô tả" value={h.description} onChange={(v) => update(idx, { description: v })} rich />
            </div>
            <div className="mt-3 grid md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Tiện ích VI (mỗi dòng 1 mục)</Label>
                <Textarea
                  value={(h.perks.vi ?? []).join("\n")}
                  onChange={(e) => update(idx, { perks: { ...h.perks, vi: toLines(e.target.value) } })}
                />
              </div>
              <div>
                <Label className="text-xs">Tiện ích EN (mỗi dòng 1 mục)</Label>
                <Textarea
                  value={(h.perks.en ?? []).join("\n")}
                  onChange={(e) => update(idx, { perks: { ...h.perks, en: toLines(e.target.value) } })}
                />
              </div>
            </div>
            <div className="mt-3 grid md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Email liên hệ</Label>
                <Input
                  value={h.contact.email ?? ""}
                  onChange={(e) => update(idx, { contact: { ...h.contact, email: e.target.value || null } })}
                />
              </div>
              <div>
                <Label className="text-xs">Điện thoại liên hệ</Label>
                <Input
                  value={h.contact.phone ?? ""}
                  onChange={(e) => update(idx, { contact: { ...h.contact, phone: e.target.value || null } })}
                />
              </div>
              <div>
                <Label className="text-xs">Website URL</Label>
                <Input
                  value={h.website_url ?? ""}
                  onChange={(e) => update(idx, { website_url: e.target.value || null })}
                />
              </div>
              <div>
                <Label className="text-xs">Map URL</Label>
                <Input
                  value={h.map_url ?? ""}
                  onChange={(e) => update(idx, { map_url: e.target.value || null })}
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs">Ảnh (mỗi dòng 1 URL)</Label>
                <Textarea
                  value={(h.images ?? []).join("\n")}
                  onChange={(e) => update(idx, { images: toLines(e.target.value) })}
                />
              </div>
            </div>
          </Card>
        ))}
        <SaveBar
          saving={saving}
          onAdd={() =>
            setItems([
              ...items,
              {
                external_id: null,
                name: "",
                tier: { ...emptyI18n },
                address: { ...emptyI18n },
                description: { ...emptyI18n },
                perks: { vi: [], en: [] },
                contact: {},
                images: [],
                map_url: null,
                website_url: null,
              },
            ])
          }
        />
      </form>
    </Card>
  );
}

// ============ NEWS ============
type NewsRow = {
  slug: string;
  tag: string | null;
  title: I18n;
  excerpt: I18n;
  body: I18nList;
  cover_url: string | null;
  author: string | null;
  read_time: string | null;
  published_at: string | null;
};

function NewsEditor({
  eventId,
  initial,
  onSaved,
}: {
  eventId: string;
  initial: never[];
  onSaved: () => void;
}) {
  const { session } = useAdminAuth();
  const saveFn = useServerFn(replaceNews);
  const [items, setItems] = useState<NewsRow[]>(
    (initial as unknown as NewsRow[]).map((n) => ({
      slug: n.slug ?? "",
      tag: n.tag ?? null,
      title: (n.title as I18n) ?? emptyI18n,
      excerpt: (n.excerpt as I18n) ?? emptyI18n,
      body: (n.body as I18nList) ?? emptyI18nList,
      cover_url: n.cover_url ?? null,
      author: n.author ?? null,
      read_time: n.read_time ?? null,
      published_at: n.published_at ?? null,
    })),
  );
  const [saving, setSaving] = useState(false);

  const update = (i: number, patch: Partial<NewsRow>) =>
    setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = session?.access_token;
    if (!t) return toast.error("Phiên đăng nhập không hợp lệ");
    setSaving(true);
    try {
      await saveFn({
        data: { event_id: eventId, items: items.map((it, idx) => ({ ...it, position: idx })) },
        headers: { Authorization: `Bearer ${t}` },
      });
      toast.success("Đã lưu tin tức");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={submit} className="space-y-4">
        {items.length === 0 && <p className="text-sm text-muted-foreground">Chưa có bài viết.</p>}
        {items.map((n, idx) => (
          <Card key={idx} className="p-4 bg-muted/30">
            <ItemHeader
              title={n.title.vi || n.title.en || n.slug || "Bài viết"}
              idx={idx}
              total={items.length}
              onUp={() => setItems(move(items, idx, -1))}
              onDown={() => setItems(move(items, idx, 1))}
              onDelete={() => setItems(items.filter((_, i) => i !== idx))}
            />
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Slug</Label>
                <Input value={n.slug} onChange={(e) => update(idx, { slug: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Tag</Label>
                <Input value={n.tag ?? ""} onChange={(e) => update(idx, { tag: e.target.value || null })} />
              </div>
              <div>
                <Label className="text-xs">Tác giả</Label>
                <Input value={n.author ?? ""} onChange={(e) => update(idx, { author: e.target.value || null })} />
              </div>
            </div>
            <div className="mt-3 space-y-3">
              <I18nField label="Tiêu đề" value={n.title} onChange={(v) => update(idx, { title: v })} />
              <I18nField label="Mô tả ngắn" value={n.excerpt} onChange={(v) => update(idx, { excerpt: v })} rich />
            </div>
            <div className="mt-3 grid md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Nội dung VI (mỗi dòng 1 đoạn)</Label>
                <Textarea
                  rows={6}
                  value={(n.body.vi ?? []).join("\n")}
                  onChange={(e) => update(idx, { body: { ...n.body, vi: toLines(e.target.value) } })}
                />
              </div>
              <div>
                <Label className="text-xs">Nội dung EN (mỗi dòng 1 đoạn)</Label>
                <Textarea
                  rows={6}
                  value={(n.body.en ?? []).join("\n")}
                  onChange={(e) => update(idx, { body: { ...n.body, en: toLines(e.target.value) } })}
                />
              </div>
            </div>
            <div className="mt-3 grid md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <Label className="text-xs">Ảnh bìa</Label>
                <ImageUpload
                  value={n.cover_url}
                  onChange={(url) => update(idx, { cover_url: url })}
                  folder="news"
                />
              </div>
              <div>
                <Label className="text-xs">Read time</Label>
                <Input
                  value={n.read_time ?? ""}
                  placeholder="5 min"
                  onChange={(e) => update(idx, { read_time: e.target.value || null })}
                />
              </div>
              <div className="md:col-span-3">
                <Label className="text-xs">Ngày đăng (ISO)</Label>
                <Input
                  type="datetime-local"
                  value={n.published_at ? new Date(n.published_at).toISOString().slice(0, 16) : ""}
                  onChange={(e) =>
                    update(idx, {
                      published_at: e.target.value ? new Date(e.target.value).toISOString() : null,
                    })
                  }
                />
              </div>
            </div>
          </Card>
        ))}
        <SaveBar
          saving={saving}
          onAdd={() =>
            setItems([
              ...items,
              {
                slug: "",
                tag: null,
                title: { ...emptyI18n },
                excerpt: { ...emptyI18n },
                body: { vi: [], en: [] },
                cover_url: null,
                author: null,
                read_time: null,
                published_at: null,
              },
            ])
          }
        />
      </form>
    </Card>
  );
}

// ============ DOCUMENTS ============
type DocRow = {
  name: I18n;
  description: I18n;
  file_url: string | null;
  file_type: string | null;
  file_size: string | null;
  requires_code: boolean;
};

function DocumentsEditor({
  eventId,
  initial,
  onSaved,
}: {
  eventId: string;
  initial: never[];
  onSaved: () => void;
}) {
  const { session } = useAdminAuth();
  const saveFn = useServerFn(replaceDocuments);
  const [items, setItems] = useState<DocRow[]>(
    (initial as unknown as DocRow[]).map((d) => ({
      name: (d.name as I18n) ?? emptyI18n,
      description: (d.description as I18n) ?? emptyI18n,
      file_url: d.file_url ?? null,
      file_type: d.file_type ?? null,
      file_size: d.file_size ?? null,
      requires_code: Boolean(d.requires_code),
    })),
  );
  const [saving, setSaving] = useState(false);

  const update = (i: number, patch: Partial<DocRow>) =>
    setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = session?.access_token;
    if (!t) return toast.error("Phiên đăng nhập không hợp lệ");
    setSaving(true);
    try {
      await saveFn({
        data: { event_id: eventId, items: items.map((it, idx) => ({ ...it, position: idx })) },
        headers: { Authorization: `Bearer ${t}` },
      });
      toast.success("Đã lưu tài liệu");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={submit} className="space-y-4">
        {items.length === 0 && <p className="text-sm text-muted-foreground">Chưa có tài liệu.</p>}
        {items.map((d, idx) => (
          <Card key={idx} className="p-4 bg-muted/30">
            <ItemHeader
              title={d.name.vi || d.name.en || "Tài liệu"}
              idx={idx}
              total={items.length}
              onUp={() => setItems(move(items, idx, -1))}
              onDown={() => setItems(move(items, idx, 1))}
              onDelete={() => setItems(items.filter((_, i) => i !== idx))}
            />
            <div className="space-y-3">
              <I18nField label="Tên" value={d.name} onChange={(v) => update(idx, { name: v })} />
              <I18nField label="Mô tả" value={d.description} onChange={(v) => update(idx, { description: v })} textarea />
              <div className="grid md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <Label className="text-xs">File</Label>
                  <ImageUpload
                    value={d.file_url}
                    onChange={(url) => update(idx, { file_url: url })}
                    folder="documents"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  />
                </div>
                <div>
                  <Label className="text-xs">Loại file</Label>
                  <Input
                    value={d.file_type ?? ""}
                    placeholder="PDF / DOCX"
                    onChange={(e) => update(idx, { file_type: e.target.value || null })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Dung lượng</Label>
                  <Input
                    value={d.file_size ?? ""}
                    placeholder="2.4 MB"
                    onChange={(e) => update(idx, { file_size: e.target.value || null })}
                  />
                </div>
                <div className="flex items-center justify-between md:col-span-2 rounded-md border p-3">
                  <div className="text-sm">Yêu cầu access code</div>
                  <Switch
                    checked={d.requires_code}
                    onCheckedChange={(v) => update(idx, { requires_code: v })}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
        <SaveBar
          saving={saving}
          onAdd={() =>
            setItems([
              ...items,
              {
                name: { ...emptyI18n },
                description: { ...emptyI18n },
                file_url: null,
                file_type: null,
                file_size: null,
                requires_code: false,
              },
            ])
          }
        />
      </form>
    </Card>
  );
}

// ============ LIBRARY ============
type LibRow = {
  external_id: string | null;
  type: "photo" | "video";
  day_index: number | null;
  title: I18n;
  thumbnail_url: string;
  source_url: string;
  requires_code: boolean;
};

function LibraryEditor({
  eventId,
  initial,
  onSaved,
}: {
  eventId: string;
  initial: never[];
  onSaved: () => void;
}) {
  const { session } = useAdminAuth();
  const saveFn = useServerFn(replaceLibrary);
  const [items, setItems] = useState<LibRow[]>(
    (initial as unknown as LibRow[]).map((l) => ({
      external_id: l.external_id ?? null,
      type: (l.type as "photo" | "video") ?? "photo",
      day_index: l.day_index ?? null,
      title: (l.title as I18n) ?? emptyI18n,
      thumbnail_url: l.thumbnail_url ?? "",
      source_url: l.source_url ?? "",
      requires_code: Boolean(l.requires_code),
    })),
  );
  const [saving, setSaving] = useState(false);

  const update = (i: number, patch: Partial<LibRow>) =>
    setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = session?.access_token;
    if (!t) return toast.error("Phiên đăng nhập không hợp lệ");
    setSaving(true);
    try {
      await saveFn({
        data: { event_id: eventId, items: items.map((it, idx) => ({ ...it, position: idx })) },
        headers: { Authorization: `Bearer ${t}` },
      });
      toast.success("Đã lưu thư viện");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={submit} className="space-y-4">
        {items.length === 0 && <p className="text-sm text-muted-foreground">Chưa có mục.</p>}
        {items.map((l, idx) => (
          <Card key={idx} className="p-4 bg-muted/30">
            <ItemHeader
              title={l.title.vi || l.title.en || l.type}
              idx={idx}
              total={items.length}
              onUp={() => setItems(move(items, idx, -1))}
              onDown={() => setItems(move(items, idx, 1))}
              onDelete={() => setItems(items.filter((_, i) => i !== idx))}
            />
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Loại</Label>
                <Select value={l.type} onValueChange={(v) => update(idx, { type: v as "photo" | "video" })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photo">photo</SelectItem>
                    <SelectItem value="video">video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Day index</Label>
                <Input
                  type="number"
                  value={l.day_index ?? ""}
                  onChange={(e) =>
                    update(idx, { day_index: e.target.value === "" ? null : Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label className="text-xs">External ID</Label>
                <Input
                  value={l.external_id ?? ""}
                  onChange={(e) => update(idx, { external_id: e.target.value || null })}
                />
              </div>
            </div>
            <div className="mt-3 space-y-3">
              <I18nField label="Tiêu đề" value={l.title} onChange={(v) => update(idx, { title: v })} />
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Thumbnail</Label>
                  <ImageUpload
                    value={l.thumbnail_url || null}
                    onChange={(url) => update(idx, { thumbnail_url: url ?? "" })}
                    folder="library/thumbs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Source (ảnh hoặc video)</Label>
                  <ImageUpload
                    value={l.source_url || null}
                    onChange={(url) => update(idx, { source_url: url ?? "" })}
                    folder="library/source"
                    accept={l.type === "video" ? "video/*" : "image/*"}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="text-sm">Yêu cầu access code</div>
                <Switch
                  checked={l.requires_code}
                  onCheckedChange={(v) => update(idx, { requires_code: v })}
                />
              </div>
            </div>
          </Card>
        ))}
        <SaveBar
          saving={saving}
          onAdd={() =>
            setItems([
              ...items,
              {
                external_id: null,
                type: "photo",
                day_index: null,
                title: { ...emptyI18n },
                thumbnail_url: "",
                source_url: "",
                requires_code: false,
              },
            ])
          }
        />
      </form>
    </Card>
  );
}

// ============ PRESS RELEASES ============
type PressRow = {
  title: I18n;
  description: I18n;
  source: string | null;
  url: string | null;
  file_url: string | null;
  published_at: string | null;
};

function PressEditor({
  eventId,
  initial,
  onSaved,
}: {
  eventId: string;
  initial: never[];
  onSaved: () => void;
}) {
  const { session } = useAdminAuth();
  const saveFn = useServerFn(replacePressReleases);
  const [items, setItems] = useState<PressRow[]>(
    (initial as unknown as PressRow[]).map((p) => ({
      title: (p.title as I18n) ?? emptyI18n,
      description: (p.description as I18n) ?? emptyI18n,
      source: p.source ?? null,
      url: p.url ?? null,
      file_url: p.file_url ?? null,
      published_at: p.published_at ?? null,
    })),
  );
  const [saving, setSaving] = useState(false);

  const update = (i: number, patch: Partial<PressRow>) =>
    setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = session?.access_token;
    if (!t) return toast.error("Phiên đăng nhập không hợp lệ");
    setSaving(true);
    try {
      await saveFn({
        data: { event_id: eventId, items: items.map((it, idx) => ({ ...it, position: idx })) },
        headers: { Authorization: `Bearer ${t}` },
      });
      toast.success("Đã lưu thông cáo");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={submit} className="space-y-4">
        {items.length === 0 && <p className="text-sm text-muted-foreground">Chưa có thông cáo.</p>}
        {items.map((p, idx) => (
          <Card key={idx} className="p-4 bg-muted/30">
            <ItemHeader
              title={p.title.vi || p.title.en || "Thông cáo"}
              idx={idx}
              total={items.length}
              onUp={() => setItems(move(items, idx, -1))}
              onDown={() => setItems(move(items, idx, 1))}
              onDelete={() => setItems(items.filter((_, i) => i !== idx))}
            />
            <div className="space-y-3">
              <I18nField label="Tiêu đề" value={p.title} onChange={(v) => update(idx, { title: v })} />
              <I18nField label="Mô tả" value={p.description} onChange={(v) => update(idx, { description: v })} textarea />
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Nguồn</Label>
                  <Input
                    value={p.source ?? ""}
                    onChange={(e) => update(idx, { source: e.target.value || null })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Ngày đăng</Label>
                  <Input
                    type="datetime-local"
                    value={p.published_at ? new Date(p.published_at).toISOString().slice(0, 16) : ""}
                    onChange={(e) =>
                      update(idx, {
                        published_at: e.target.value ? new Date(e.target.value).toISOString() : null,
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">URL</Label>
                  <Input value={p.url ?? ""} onChange={(e) => update(idx, { url: e.target.value || null })} />
                </div>
                <div>
                  <Label className="text-xs">File</Label>
                  <ImageUpload
                    value={p.file_url}
                    onChange={(url) => update(idx, { file_url: url })}
                    folder="press"
                    accept=".pdf,.doc,.docx"
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
        <SaveBar
          saving={saving}
          onAdd={() =>
            setItems([
              ...items,
              {
                title: { ...emptyI18n },
                description: { ...emptyI18n },
                source: null,
                url: null,
                file_url: null,
                published_at: null,
              },
            ])
          }
        />
      </form>
    </Card>
  );
}

// ============ ACCESS CODES ============
type CodeRow = {
  code: string;
  label: I18n;
  scope: "all" | "document" | "library" | "registration";
  max_uses: number | null;
  expires_at: string | null;
  active: boolean;
  used_count?: number;
};

function AccessCodesEditor({
  eventId,
  initial,
  onSaved,
}: {
  eventId: string;
  initial: never[];
  onSaved: () => void;
}) {
  const { session } = useAdminAuth();
  const saveFn = useServerFn(replaceAccessCodes);
  const [items, setItems] = useState<CodeRow[]>(
    (initial as unknown as CodeRow[]).map((c) => ({
      code: c.code ?? "",
      label: (c.label as I18n) ?? emptyI18n,
      scope: (c.scope as CodeRow["scope"]) ?? "all",
      max_uses: c.max_uses ?? null,
      expires_at: c.expires_at ?? null,
      active: c.active ?? true,
      used_count: c.used_count ?? 0,
    })),
  );
  const [saving, setSaving] = useState(false);

  const update = (i: number, patch: Partial<CodeRow>) =>
    setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = session?.access_token;
    if (!t) return toast.error("Phiên đăng nhập không hợp lệ");
    setSaving(true);
    try {
      await saveFn({
        data: {
          event_id: eventId,
          items: items.map((it) => ({
            code: it.code,
            label: it.label,
            scope: it.scope,
            max_uses: it.max_uses,
            expires_at: it.expires_at,
            active: it.active,
          })),
        },
        headers: { Authorization: `Bearer ${t}` },
      });
      toast.success("Đã lưu access codes");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={submit} className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Mỗi mã có thể giới hạn phạm vi (toàn bộ / chỉ tài liệu / chỉ thư viện / chỉ đăng ký), số lần dùng và hạn sử dụng.
        </p>
        {items.length === 0 && <p className="text-sm text-muted-foreground">Chưa có mã.</p>}
        {items.map((c, idx) => (
          <Card key={idx} className="p-4 bg-muted/30">
            <ItemHeader
              title={c.code || "Mã mới"}
              idx={idx}
              total={items.length}
              onUp={() => setItems(move(items, idx, -1))}
              onDown={() => setItems(move(items, idx, 1))}
              onDelete={() => setItems(items.filter((_, i) => i !== idx))}
            />
            <div className="grid md:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs">Mã</Label>
                <Input value={c.code} onChange={(e) => update(idx, { code: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Phạm vi</Label>
                <Select value={c.scope} onValueChange={(v) => update(idx, { scope: v as CodeRow["scope"] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">all</SelectItem>
                    <SelectItem value="document">document</SelectItem>
                    <SelectItem value="library">library</SelectItem>
                    <SelectItem value="registration">registration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Số lần tối đa</Label>
                <Input
                  type="number"
                  value={c.max_uses ?? ""}
                  onChange={(e) =>
                    update(idx, { max_uses: e.target.value === "" ? null : Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Hết hạn</Label>
                <Input
                  type="datetime-local"
                  value={c.expires_at ? new Date(c.expires_at).toISOString().slice(0, 16) : ""}
                  onChange={(e) =>
                    update(idx, {
                      expires_at: e.target.value ? new Date(e.target.value).toISOString() : null,
                    })
                  }
                />
              </div>
            </div>
            <div className="mt-3">
              <I18nField label="Nhãn" value={c.label} onChange={(v) => update(idx, { label: v })} />
            </div>
            <div className="mt-3 flex items-center justify-between rounded-md border p-3">
              <div className="text-sm">
                Đang hoạt động
                <span className="ml-3 text-xs text-muted-foreground">
                  Đã dùng: {c.used_count ?? 0}
                </span>
              </div>
              <Switch checked={c.active} onCheckedChange={(v) => update(idx, { active: v })} />
            </div>
          </Card>
        ))}
        <SaveBar
          saving={saving}
          addLabel="Thêm mã"
          onAdd={() =>
            setItems([
              ...items,
              {
                code: "",
                label: { ...emptyI18n },
                scope: "all",
                max_uses: null,
                expires_at: null,
                active: true,
              },
            ])
          }
        />
      </form>
    </Card>
  );
}
