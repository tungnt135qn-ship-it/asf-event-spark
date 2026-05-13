import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  getEventContentAdmin,
  upsertHero,
  upsertOverview,
  replaceWhyAttend,
  replaceKeyContent,
} from "@/lib/event-content-admin.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Save, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextI18nField } from "@/components/admin/RichTextEditor";

type I18n = { vi: string; en: string };
const emptyI18n: I18n = { vi: "", en: "" };

function I18nField({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: I18n;
  onChange: (v: I18n) => void;
  textarea?: boolean;
}) {
  const Field = textarea ? Textarea : Input;
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <div className="text-[11px] uppercase text-muted-foreground mb-1">VI</div>
          <Field
            value={value?.vi ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              onChange({ ...value, vi: e.target.value })
            }
          />
        </div>
        <div>
          <div className="text-[11px] uppercase text-muted-foreground mb-1">EN</div>
          <Field
            value={value?.en ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              onChange({ ...value, en: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}

function toLocalDateTime(v: string | null): string {
  if (!v) return "";
  const d = new Date(v);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalDateTime(v: string): string | null {
  return v ? new Date(v).toISOString() : null;
}

export function ContentTab({ eventId }: { eventId: string }) {
  const { session } = useAdminAuth();
  const fetchFn = useServerFn(getEventContentAdmin);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-event-content", eventId],
    queryFn: async () => {
      const token = session?.access_token;
      if (!token) throw new Error("Phiên đăng nhập không hợp lệ");
      return fetchFn({ data: { event_id: eventId }, headers: { Authorization: `Bearer ${token}` } });
    },
    enabled: Boolean(session?.access_token),
  });

  if (isLoading) return <div className="text-sm text-muted-foreground p-6">Đang tải nội dung…</div>;
  if (isError || !data)
    return (
      <Card className="p-5 text-sm text-destructive">
        {error instanceof Error ? error.message : "Không tải được nội dung."}
      </Card>
    );

  return (
    <Tabs defaultValue="hero">
      <TabsList>
        <TabsTrigger value="hero">Hero</TabsTrigger>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="why">Why Attend</TabsTrigger>
        <TabsTrigger value="key">Key Content</TabsTrigger>
      </TabsList>
      <TabsContent value="hero" className="mt-4">
        <HeroForm eventId={eventId} initial={data.hero as Record<string, unknown> | null} onSaved={refetch} />
      </TabsContent>
      <TabsContent value="overview" className="mt-4">
        <OverviewForm
          eventId={eventId}
          initial={data.overview as Record<string, unknown> | null}
          onSaved={refetch}
        />
      </TabsContent>
      <TabsContent value="why" className="mt-4">
        <WhyForm
          eventId={eventId}
          initial={(data.why_attend_items as Record<string, unknown>[]) ?? []}
          onSaved={refetch}
        />
      </TabsContent>
      <TabsContent value="key" className="mt-4">
        <KeyForm
          eventId={eventId}
          initial={(data.key_contents as Record<string, unknown>[]) ?? []}
          onSaved={refetch}
        />
      </TabsContent>
    </Tabs>
  );
}

function useAuthHeaders() {
  const { session } = useAdminAuth();
  return () => {
    const t = session?.access_token;
    if (!t) throw new Error("Phiên đăng nhập không hợp lệ");
    return { Authorization: `Bearer ${t}` };
  };
}

// -------------------- HERO --------------------
type HeroState = {
  tagline: I18n;
  lead: I18n;
  date_text: I18n;
  location_text: I18n;
  cta_register_label: I18n;
  cta_agenda_label: I18n;
  background_url: string | null;
  countdown_to: string | null;
};

function HeroForm({
  eventId,
  initial,
  onSaved,
}: {
  eventId: string;
  initial: Record<string, unknown> | null;
  onSaved: () => void;
}) {
  const auth = useAuthHeaders();
  const saveFn = useServerFn(upsertHero);
  const [saving, setSaving] = useState(false);

  const seed: HeroState = {
    tagline: (initial?.tagline as I18n) ?? emptyI18n,
    lead: (initial?.lead as I18n) ?? emptyI18n,
    date_text: (initial?.date_text as I18n) ?? emptyI18n,
    location_text: (initial?.location_text as I18n) ?? emptyI18n,
    cta_register_label: (initial?.cta_register_label as I18n) ?? emptyI18n,
    cta_agenda_label: (initial?.cta_agenda_label as I18n) ?? emptyI18n,
    background_url: (initial?.background_url as string | null) ?? null,
    countdown_to: (initial?.countdown_to as string | null) ?? null,
  };
  const [form, setForm] = useState<HeroState>(seed);
  useEffect(() => setForm(seed), [eventId]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveFn({ data: { event_id: eventId, ...form }, headers: auth() });
      toast.success("Đã lưu Hero");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={submit} className="space-y-5">
        <I18nField label="Tagline" value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} />
        <I18nField label="Lead" value={form.lead} onChange={(v) => setForm({ ...form, lead: v })} textarea />
        <I18nField label="Date text" value={form.date_text} onChange={(v) => setForm({ ...form, date_text: v })} />
        <I18nField
          label="Location text"
          value={form.location_text}
          onChange={(v) => setForm({ ...form, location_text: v })}
        />
        <I18nField
          label="CTA Register label"
          value={form.cta_register_label}
          onChange={(v) => setForm({ ...form, cta_register_label: v })}
        />
        <I18nField
          label="CTA Agenda label"
          value={form.cta_agenda_label}
          onChange={(v) => setForm({ ...form, cta_agenda_label: v })}
        />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Background</Label>
            <ImageUpload
              value={form.background_url}
              onChange={(url) => setForm({ ...form, background_url: url })}
              folder="hero"
            />
          </div>
          <div className="space-y-2">
            <Label>Countdown to</Label>
            <Input
              type="datetime-local"
              value={toLocalDateTime(form.countdown_to)}
              onChange={(e) => setForm({ ...form, countdown_to: fromLocalDateTime(e.target.value) })}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            <Save className="mr-2 h-4 w-4" /> {saving ? "Đang lưu…" : "Lưu Hero"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

// -------------------- OVERVIEW --------------------
type OverviewState = {
  eyebrow: I18n;
  title: I18n;
  lead: I18n;
  orgs_title: I18n;
  orgs: Array<Record<string, unknown>>;
  highlights: Array<Record<string, unknown>>;
};

function OverviewForm({
  eventId,
  initial,
  onSaved,
}: {
  eventId: string;
  initial: Record<string, unknown> | null;
  onSaved: () => void;
}) {
  const auth = useAuthHeaders();
  const saveFn = useServerFn(upsertOverview);
  const [saving, setSaving] = useState(false);

  const seed: OverviewState = {
    eyebrow: (initial?.eyebrow as I18n) ?? emptyI18n,
    title: (initial?.title as I18n) ?? emptyI18n,
    lead: (initial?.lead as I18n) ?? emptyI18n,
    orgs_title: (initial?.orgs_title as I18n) ?? emptyI18n,
    orgs: (initial?.orgs as Array<Record<string, unknown>>) ?? [],
    highlights: (initial?.highlights as Array<Record<string, unknown>>) ?? [],
  };
  const [form, setForm] = useState<OverviewState>(seed);
  const [orgsJson, setOrgsJson] = useState(JSON.stringify(seed.orgs, null, 2));
  const [highlightsJson, setHighlightsJson] = useState(JSON.stringify(seed.highlights, null, 2));
  useEffect(() => {
    setForm(seed);
    setOrgsJson(JSON.stringify(seed.orgs, null, 2));
    setHighlightsJson(JSON.stringify(seed.highlights, null, 2));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    let orgs: Array<Record<string, unknown>>;
    let highlights: Array<Record<string, unknown>>;
    try {
      orgs = JSON.parse(orgsJson);
      if (!Array.isArray(orgs)) throw new Error();
    } catch {
      toast.error("Orgs JSON không hợp lệ (phải là array)");
      return;
    }
    try {
      highlights = JSON.parse(highlightsJson);
      if (!Array.isArray(highlights)) throw new Error();
    } catch {
      toast.error("Highlights JSON không hợp lệ (phải là array)");
      return;
    }
    setSaving(true);
    try {
      await saveFn({
        data: {
          event_id: eventId,
          eyebrow: form.eyebrow,
          title: form.title,
          lead: form.lead,
          orgs_title: form.orgs_title,
          orgs,
          highlights,
        },
        headers: auth(),
      });
      toast.success("Đã lưu Overview");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={submit} className="space-y-5">
        <I18nField label="Eyebrow" value={form.eyebrow} onChange={(v) => setForm({ ...form, eyebrow: v })} />
        <I18nField label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <I18nField label="Lead" value={form.lead} onChange={(v) => setForm({ ...form, lead: v })} textarea />
        <I18nField
          label="Orgs title"
          value={form.orgs_title}
          onChange={(v) => setForm({ ...form, orgs_title: v })}
        />
        <div className="space-y-2">
          <Label>Orgs (JSON array)</Label>
          <Textarea
            className="font-mono text-xs min-h-32"
            value={orgsJson}
            onChange={(e) => setOrgsJson(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Mỗi org là object tự do — VD: <code>{`{ "name": "...", "logo_url": "..." }`}</code>
          </p>
        </div>
        <div className="space-y-2">
          <Label>Highlights (JSON array)</Label>
          <Textarea
            className="font-mono text-xs min-h-32"
            value={highlightsJson}
            onChange={(e) => setHighlightsJson(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            <Save className="mr-2 h-4 w-4" /> {saving ? "Đang lưu…" : "Lưu Overview"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

// -------------------- WHY ATTEND --------------------
type WhyItem = {
  position: number;
  icon: string | null;
  stat: string | null;
  stat_label: I18n;
  title: I18n;
  description: I18n;
};

function WhyForm({
  eventId,
  initial,
  onSaved,
}: {
  eventId: string;
  initial: Array<Record<string, unknown>>;
  onSaved: () => void;
}) {
  const auth = useAuthHeaders();
  const saveFn = useServerFn(replaceWhyAttend);
  const [saving, setSaving] = useState(false);

  const seed: WhyItem[] = initial.map((r, idx) => ({
    position: (r.position as number) ?? idx,
    icon: (r.icon as string | null) ?? null,
    stat: (r.stat as string | null) ?? null,
    stat_label: (r.stat_label as I18n) ?? emptyI18n,
    title: (r.title as I18n) ?? emptyI18n,
    description: (r.description as I18n) ?? emptyI18n,
  }));
  const [items, setItems] = useState<WhyItem[]>(seed);
  useEffect(() => setItems(seed), [eventId]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (idx: number, patch: Partial<WhyItem>) =>
    setItems(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[idx], next[j]] = [next[j], next[idx]];
    setItems(next);
  };

  const submit = async () => {
    setSaving(true);
    try {
      await saveFn({ data: { event_id: eventId, items }, headers: auth() });
      toast.success("Đã lưu Why Attend");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{items.length} mục</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            setItems([
              ...items,
              {
                position: items.length,
                icon: null,
                stat: null,
                stat_label: emptyI18n,
                title: emptyI18n,
                description: emptyI18n,
              },
            ])
          }
        >
          <Plus className="mr-1 h-4 w-4" /> Thêm mục
        </Button>
      </div>

      {items.map((it, idx) => (
        <Card key={idx} className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-muted-foreground">#{idx + 1}</div>
            <div className="flex gap-1">
              <Button type="button" size="icon" variant="ghost" onClick={() => move(idx, -1)}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" variant="ghost" onClick={() => move(idx, 1)}>
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setItems(items.filter((_, i) => i !== idx))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Icon</Label>
              <Input value={it.icon ?? ""} onChange={(e) => update(idx, { icon: e.target.value || null })} />
            </div>
            <div className="space-y-2">
              <Label>Stat</Label>
              <Input value={it.stat ?? ""} onChange={(e) => update(idx, { stat: e.target.value || null })} />
            </div>
          </div>
          <I18nField label="Stat label" value={it.stat_label} onChange={(v) => update(idx, { stat_label: v })} />
          <I18nField label="Title" value={it.title} onChange={(v) => update(idx, { title: v })} />
          <I18nField
            label="Description"
            value={it.description}
            onChange={(v) => update(idx, { description: v })}
            textarea
          />
        </Card>
      ))}

      <div className="flex justify-end">
        <Button onClick={submit} disabled={saving}>
          <Save className="mr-2 h-4 w-4" /> {saving ? "Đang lưu…" : "Lưu Why Attend"}
        </Button>
      </div>
    </div>
  );
}

// -------------------- KEY CONTENT --------------------
type KeyItem = {
  position: number;
  image_url: string | null;
  title: I18n;
  body: I18n;
};

function KeyForm({
  eventId,
  initial,
  onSaved,
}: {
  eventId: string;
  initial: Array<Record<string, unknown>>;
  onSaved: () => void;
}) {
  const auth = useAuthHeaders();
  const saveFn = useServerFn(replaceKeyContent);
  const [saving, setSaving] = useState(false);

  const seed: KeyItem[] = initial.map((r, idx) => ({
    position: (r.position as number) ?? idx,
    image_url: (r.image_url as string | null) ?? null,
    title: (r.title as I18n) ?? emptyI18n,
    body: (r.body as I18n) ?? emptyI18n,
  }));
  const [items, setItems] = useState<KeyItem[]>(seed);
  useEffect(() => setItems(seed), [eventId]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (idx: number, patch: Partial<KeyItem>) =>
    setItems(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[idx], next[j]] = [next[j], next[idx]];
    setItems(next);
  };

  const submit = async () => {
    setSaving(true);
    try {
      await saveFn({ data: { event_id: eventId, items }, headers: auth() });
      toast.success("Đã lưu Key Content");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{items.length} mục</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            setItems([
              ...items,
              { position: items.length, image_url: null, title: emptyI18n, body: emptyI18n },
            ])
          }
        >
          <Plus className="mr-1 h-4 w-4" /> Thêm mục
        </Button>
      </div>

      {items.map((it, idx) => (
        <Card key={idx} className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-muted-foreground">#{idx + 1}</div>
            <div className="flex gap-1">
              <Button type="button" size="icon" variant="ghost" onClick={() => move(idx, -1)}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" variant="ghost" onClick={() => move(idx, 1)}>
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setItems(items.filter((_, i) => i !== idx))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Image</Label>
            <ImageUpload
              value={it.image_url}
              onChange={(url) => update(idx, { image_url: url })}
              folder="key-content"
            />
          </div>
          <I18nField label="Title" value={it.title} onChange={(v) => update(idx, { title: v })} />
          <I18nField label="Body" value={it.body} onChange={(v) => update(idx, { body: v })} textarea />
        </Card>
      ))}

      <div className="flex justify-end">
        <Button onClick={submit} disabled={saving}>
          <Save className="mr-2 h-4 w-4" /> {saving ? "Đang lưu…" : "Lưu Key Content"}
        </Button>
      </div>
    </div>
  );
}
