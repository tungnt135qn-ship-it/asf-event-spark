import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  getEventModulesAdmin,
  replaceSpeakers,
  replaceTopics,
  replaceSponsors,
  replaceFaqs,
  replaceAgenda,
} from "@/lib/event-modules-admin.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export function ModulesTab({ eventId }: { eventId: string }) {
  const { session } = useAdminAuth();
  const fetchAll = useServerFn(getEventModulesAdmin);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-event-modules", eventId],
    queryFn: async () => {
      const token = session?.access_token;
      if (!token) throw new Error("Phiên đăng nhập không hợp lệ");
      return fetchAll({
        data: { event_id: eventId },
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    enabled: Boolean(session?.access_token),
  });

  if (isLoading || !data) {
    return <Card className="p-6 text-sm text-muted-foreground">Đang tải…</Card>;
  }

  return (
    <Tabs defaultValue="speakers">
      <TabsList className="flex-wrap h-auto">
        <TabsTrigger value="speakers">Diễn giả</TabsTrigger>
        <TabsTrigger value="topics">Chủ đề</TabsTrigger>
        <TabsTrigger value="agenda">Lịch trình</TabsTrigger>
        <TabsTrigger value="sponsors">Nhà tài trợ</TabsTrigger>
        <TabsTrigger value="faqs">FAQ</TabsTrigger>
      </TabsList>

      <TabsContent value="speakers" className="mt-4">
        <SpeakersEditor eventId={eventId} initial={data.speakers as never} onSaved={refetch} />
      </TabsContent>
      <TabsContent value="topics" className="mt-4">
        <TopicsEditor eventId={eventId} initial={data.topics as never} onSaved={refetch} />
      </TabsContent>
      <TabsContent value="agenda" className="mt-4">
        <AgendaEditor
          eventId={eventId}
          days={data.agenda_days as never}
          sessions={data.agenda_sessions as never}
          onSaved={refetch}
        />
      </TabsContent>
      <TabsContent value="sponsors" className="mt-4">
        <SponsorsEditor eventId={eventId} initial={data.sponsors as never} onSaved={refetch} />
      </TabsContent>
      <TabsContent value="faqs" className="mt-4">
        <FaqsEditor eventId={eventId} initial={data.faqs as never} onSaved={refetch} />
      </TabsContent>
    </Tabs>
  );
}

function useAuthHeader() {
  const { session } = useAdminAuth();
  return () => {
    const t = session?.access_token;
    if (!t) throw new Error("Phiên đăng nhập không hợp lệ");
    return { Authorization: `Bearer ${t}` };
  };
}

/* ---------------- SPEAKERS ---------------- */
type SpeakerRow = {
  id?: string;
  position: number;
  external_id: string | null;
  honorific: string | null;
  full_name: string;
  avatar_url: string | null;
  role: I18n;
  organization: I18n;
  bio: I18n;
  topic_slugs: string[];
  socials: Record<string, string>;
};

function SpeakersEditor({
  eventId,
  initial,
  onSaved,
}: {
  eventId: string;
  initial: SpeakerRow[];
  onSaved: () => void;
}) {
  const auth = useAuthHeader();
  const save = useServerFn(replaceSpeakers);
  const [items, setItems] = useState<SpeakerRow[]>(() => normalizeSpeakers(initial));
  const [saving, setSaving] = useState(false);

  useEffect(() => setItems(normalizeSpeakers(initial)), [initial]);

  const submit = async () => {
    setSaving(true);
    try {
      await save({
        data: {
          event_id: eventId,
          items: items.map((it, idx) => ({ ...it, position: idx })),
        },
        headers: auth(),
      });
      toast.success("Đã lưu danh sách diễn giả");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Diễn giả ({items.length})</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setItems((p) => [
                ...p,
                {
                  position: p.length,
                  external_id: null,
                  honorific: null,
                  full_name: "",
                  avatar_url: null,
                  role: { ...emptyI18n },
                  organization: { ...emptyI18n },
                  bio: { ...emptyI18n },
                  topic_slugs: [],
                  socials: {},
                },
              ])
            }
          >
            <Plus className="mr-1 h-4 w-4" /> Thêm
          </Button>
          <Button size="sm" onClick={submit} disabled={saving}>
            <Save className="mr-1 h-4 w-4" /> Lưu
          </Button>
        </div>
      </div>

      {items.map((sp, i) => (
        <Card key={i} className="p-4 space-y-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">#{i + 1}</span>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => setItems((p) => move(p, i, -1))}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setItems((p) => move(p, i, 1))}>
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Họ và tên *</Label>
              <Input
                value={sp.full_name}
                onChange={(e) =>
                  setItems((p) => p.map((x, idx) => (idx === i ? { ...x, full_name: e.target.value } : x)))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Honorific (Mr., PhD…)</Label>
              <Input
                value={sp.honorific ?? ""}
                onChange={(e) =>
                  setItems((p) =>
                    p.map((x, idx) => (idx === i ? { ...x, honorific: e.target.value || null } : x))
                  )
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">External ID</Label>
              <Input
                value={sp.external_id ?? ""}
                onChange={(e) =>
                  setItems((p) =>
                    p.map((x, idx) => (idx === i ? { ...x, external_id: e.target.value || null } : x))
                  )
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Avatar</Label>
            <ImageUpload
              value={sp.avatar_url}
              onChange={(url) =>
                setItems((p) => p.map((x, idx) => (idx === i ? { ...x, avatar_url: url } : x)))
              }
              folder="speakers"
            />
          </div>

          <I18nField
            label="Vai trò"
            value={sp.role}
            onChange={(v) => setItems((p) => p.map((x, idx) => (idx === i ? { ...x, role: v } : x)))}
          />
          <I18nField
            label="Tổ chức"
            value={sp.organization}
            onChange={(v) =>
              setItems((p) => p.map((x, idx) => (idx === i ? { ...x, organization: v } : x)))
            }
          />
          <I18nField
            label="Tiểu sử"
            value={sp.bio}
            textarea
            onChange={(v) => setItems((p) => p.map((x, idx) => (idx === i ? { ...x, bio: v } : x)))}
          />

          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Topic slugs (cách nhau bằng dấu phẩy)</Label>
              <Input
                value={sp.topic_slugs.join(", ")}
                onChange={(e) =>
                  setItems((p) =>
                    p.map((x, idx) =>
                      idx === i
                        ? {
                            ...x,
                            topic_slugs: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          }
                        : x
                    )
                  )
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Socials (JSON)</Label>
              <Input
                value={JSON.stringify(sp.socials)}
                onChange={(e) => {
                  try {
                    const v = JSON.parse(e.target.value || "{}");
                    setItems((p) => p.map((x, idx) => (idx === i ? { ...x, socials: v } : x)));
                  } catch {
                    /* ignore */
                  }
                }}
              />
            </div>
          </div>
        </Card>
      ))}
    </Card>
  );
}

function normalizeSpeakers(rows: unknown): SpeakerRow[] {
  return ((rows as Record<string, unknown>[]) ?? []).map((r) => ({
    id: r.id as string,
    position: (r.position as number) ?? 0,
    external_id: (r.external_id as string) ?? null,
    honorific: (r.honorific as string) ?? null,
    full_name: (r.full_name as string) ?? "",
    avatar_url: (r.avatar_url as string) ?? null,
    role: (r.role as I18n) ?? emptyI18n,
    organization: (r.organization as I18n) ?? emptyI18n,
    bio: (r.bio as I18n) ?? emptyI18n,
    topic_slugs: (r.topic_slugs as string[]) ?? [],
    socials: (r.socials as Record<string, string>) ?? {},
  }));
}

/* ---------------- TOPICS ---------------- */
type TopicRow = {
  id?: string;
  position: number;
  slug: string;
  abbr: string | null;
  image_url: string | null;
  title: I18n;
  summary: I18n;
  long_description: I18n;
};

function TopicsEditor({
  eventId,
  initial,
  onSaved,
}: {
  eventId: string;
  initial: TopicRow[];
  onSaved: () => void;
}) {
  const auth = useAuthHeader();
  const save = useServerFn(replaceTopics);
  const [items, setItems] = useState<TopicRow[]>(() => normalizeTopics(initial));
  const [saving, setSaving] = useState(false);
  useEffect(() => setItems(normalizeTopics(initial)), [initial]);

  const submit = async () => {
    setSaving(true);
    try {
      await save({
        data: { event_id: eventId, items: items.map((x, i) => ({ ...x, position: i })) },
        headers: auth(),
      });
      toast.success("Đã lưu chủ đề");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Chủ đề ({items.length})</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setItems((p) => [
                ...p,
                {
                  position: p.length,
                  slug: "",
                  abbr: null,
                  image_url: null,
                  title: { ...emptyI18n },
                  summary: { ...emptyI18n },
                  long_description: { ...emptyI18n },
                },
              ])
            }
          >
            <Plus className="mr-1 h-4 w-4" /> Thêm
          </Button>
          <Button size="sm" onClick={submit} disabled={saving}>
            <Save className="mr-1 h-4 w-4" /> Lưu
          </Button>
        </div>
      </div>

      {items.map((t, i) => (
        <Card key={i} className="p-4 space-y-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">#{i + 1}</span>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => setItems((p) => move(p, i, -1))}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setItems((p) => move(p, i, 1))}>
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Slug *</Label>
              <Input
                value={t.slug}
                onChange={(e) =>
                  setItems((p) => p.map((x, idx) => (idx === i ? { ...x, slug: e.target.value } : x)))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Viết tắt</Label>
              <Input
                value={t.abbr ?? ""}
                onChange={(e) =>
                  setItems((p) => p.map((x, idx) => (idx === i ? { ...x, abbr: e.target.value || null } : x)))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Image URL</Label>
              <Input
                value={t.image_url ?? ""}
                onChange={(e) =>
                  setItems((p) =>
                    p.map((x, idx) => (idx === i ? { ...x, image_url: e.target.value || null } : x))
                  )
                }
              />
            </div>
          </div>
          <I18nField
            label="Tiêu đề"
            value={t.title}
            onChange={(v) => setItems((p) => p.map((x, idx) => (idx === i ? { ...x, title: v } : x)))}
          />
          <I18nField
            label="Tóm tắt"
            value={t.summary}
            textarea
            onChange={(v) => setItems((p) => p.map((x, idx) => (idx === i ? { ...x, summary: v } : x)))}
          />
          <I18nField
            label="Mô tả chi tiết"
            value={t.long_description}
            textarea
            onChange={(v) =>
              setItems((p) => p.map((x, idx) => (idx === i ? { ...x, long_description: v } : x)))
            }
          />
        </Card>
      ))}
    </Card>
  );
}

function normalizeTopics(rows: unknown): TopicRow[] {
  return ((rows as Record<string, unknown>[]) ?? []).map((r) => ({
    id: r.id as string,
    position: (r.position as number) ?? 0,
    slug: (r.slug as string) ?? "",
    abbr: (r.abbr as string) ?? null,
    image_url: (r.image_url as string) ?? null,
    title: (r.title as I18n) ?? emptyI18n,
    summary: (r.summary as I18n) ?? emptyI18n,
    long_description: (r.long_description as I18n) ?? emptyI18n,
  }));
}

/* ---------------- SPONSORS ---------------- */
type SponsorRow = {
  id?: string;
  position: number;
  name: string;
  tier: "diamond" | "gold" | "silver" | "bronze" | "partner";
  logo_url: string | null;
  website_url: string | null;
};

function SponsorsEditor({
  eventId,
  initial,
  onSaved,
}: {
  eventId: string;
  initial: SponsorRow[];
  onSaved: () => void;
}) {
  const auth = useAuthHeader();
  const save = useServerFn(replaceSponsors);
  const [items, setItems] = useState<SponsorRow[]>(
    () =>
      ((initial as unknown as Record<string, unknown>[]) ?? []).map((r) => ({
        id: r.id as string,
        position: (r.position as number) ?? 0,
        name: (r.name as string) ?? "",
        tier: (r.tier as SponsorRow["tier"]) ?? "partner",
        logo_url: (r.logo_url as string) ?? null,
        website_url: (r.website_url as string) ?? null,
      }))
  );
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await save({
        data: { event_id: eventId, items: items.map((x, i) => ({ ...x, position: i })) },
        headers: auth(),
      });
      toast.success("Đã lưu nhà tài trợ");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Nhà tài trợ ({items.length})</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setItems((p) => [
                ...p,
                {
                  position: p.length,
                  name: "",
                  tier: "partner",
                  logo_url: null,
                  website_url: null,
                },
              ])
            }
          >
            <Plus className="mr-1 h-4 w-4" /> Thêm
          </Button>
          <Button size="sm" onClick={submit} disabled={saving}>
            <Save className="mr-1 h-4 w-4" /> Lưu
          </Button>
        </div>
      </div>

      {items.map((s, i) => (
        <Card key={i} className="p-4 bg-muted/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">#{i + 1}</span>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => setItems((p) => move(p, i, -1))}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setItems((p) => move(p, i, 1))}>
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Tên *</Label>
              <Input
                value={s.name}
                onChange={(e) =>
                  setItems((p) => p.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Tier</Label>
              <Select
                value={s.tier}
                onValueChange={(v) =>
                  setItems((p) =>
                    p.map((x, idx) => (idx === i ? { ...x, tier: v as SponsorRow["tier"] } : x))
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diamond">Diamond</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Logo URL</Label>
              <Input
                value={s.logo_url ?? ""}
                onChange={(e) =>
                  setItems((p) =>
                    p.map((x, idx) => (idx === i ? { ...x, logo_url: e.target.value || null } : x))
                  )
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Website</Label>
              <Input
                value={s.website_url ?? ""}
                onChange={(e) =>
                  setItems((p) =>
                    p.map((x, idx) => (idx === i ? { ...x, website_url: e.target.value || null } : x))
                  )
                }
              />
            </div>
          </div>
        </Card>
      ))}
    </Card>
  );
}

/* ---------------- FAQS ---------------- */
type FaqRow = {
  id?: string;
  position: number;
  category: I18n;
  question: I18n;
  answer: I18n;
};

function FaqsEditor({
  eventId,
  initial,
  onSaved,
}: {
  eventId: string;
  initial: FaqRow[];
  onSaved: () => void;
}) {
  const auth = useAuthHeader();
  const save = useServerFn(replaceFaqs);
  const [items, setItems] = useState<FaqRow[]>(
    () =>
      ((initial as unknown as Record<string, unknown>[]) ?? []).map((r) => ({
        id: r.id as string,
        position: (r.position as number) ?? 0,
        category: (r.category as I18n) ?? emptyI18n,
        question: (r.question as I18n) ?? emptyI18n,
        answer: (r.answer as I18n) ?? emptyI18n,
      }))
  );
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await save({
        data: { event_id: eventId, items: items.map((x, i) => ({ ...x, position: i })) },
        headers: auth(),
      });
      toast.success("Đã lưu FAQ");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">FAQ ({items.length})</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setItems((p) => [
                ...p,
                {
                  position: p.length,
                  category: { ...emptyI18n },
                  question: { ...emptyI18n },
                  answer: { ...emptyI18n },
                },
              ])
            }
          >
            <Plus className="mr-1 h-4 w-4" /> Thêm
          </Button>
          <Button size="sm" onClick={submit} disabled={saving}>
            <Save className="mr-1 h-4 w-4" /> Lưu
          </Button>
        </div>
      </div>

      {items.map((f, i) => (
        <Card key={i} className="p-4 bg-muted/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">#{i + 1}</span>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => setItems((p) => move(p, i, -1))}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setItems((p) => move(p, i, 1))}>
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
          <I18nField
            label="Danh mục"
            value={f.category}
            onChange={(v) => setItems((p) => p.map((x, idx) => (idx === i ? { ...x, category: v } : x)))}
          />
          <I18nField
            label="Câu hỏi"
            value={f.question}
            onChange={(v) => setItems((p) => p.map((x, idx) => (idx === i ? { ...x, question: v } : x)))}
          />
          <I18nField
            label="Trả lời"
            value={f.answer}
            textarea
            onChange={(v) => setItems((p) => p.map((x, idx) => (idx === i ? { ...x, answer: v } : x)))}
          />
        </Card>
      ))}
    </Card>
  );
}

/* ---------------- AGENDA ---------------- */
type SessionRow = {
  position: number;
  time_text: string;
  title: I18n;
  description: I18n;
  location: I18n;
  tag: string | null;
};
type DayRow = {
  position: number;
  date: string;
  label: I18n;
  topic_slugs: string[];
  speaker_external_ids: string[];
  sessions: SessionRow[];
};

function AgendaEditor({
  eventId,
  days,
  sessions,
  onSaved,
}: {
  eventId: string;
  days: Record<string, unknown>[];
  sessions: Record<string, unknown>[];
  onSaved: () => void;
}) {
  const auth = useAuthHeader();
  const save = useServerFn(replaceAgenda);

  const initial: DayRow[] = useMemo(() => {
    const sortedDays = [...(days ?? [])].sort(
      (a, b) => ((a.position as number) ?? 0) - ((b.position as number) ?? 0)
    );
    return sortedDays.map((d) => {
      const dayId = d.id as string;
      const ds = (sessions ?? [])
        .filter((s) => (s.day_id as string) === dayId)
        .sort((a, b) => ((a.position as number) ?? 0) - ((b.position as number) ?? 0));
      return {
        position: (d.position as number) ?? 0,
        date: (d.date as string) ?? "",
        label: (d.label as I18n) ?? emptyI18n,
        topic_slugs: (d.topic_slugs as string[]) ?? [],
        speaker_external_ids: (d.speaker_external_ids as string[]) ?? [],
        sessions: ds.map((s) => ({
          position: (s.position as number) ?? 0,
          time_text: (s.time_text as string) ?? "",
          title: (s.title as I18n) ?? emptyI18n,
          description: (s.description as I18n) ?? emptyI18n,
          location: (s.location as I18n) ?? emptyI18n,
          tag: (s.tag as string) ?? null,
        })),
      };
    });
  }, [days, sessions]);

  const [items, setItems] = useState<DayRow[]>(initial);
  const [saving, setSaving] = useState(false);
  useEffect(() => setItems(initial), [initial]);

  const submit = async () => {
    setSaving(true);
    try {
      await save({
        data: {
          event_id: eventId,
          days: items.map((d, i) => ({
            ...d,
            position: i,
            sessions: d.sessions.map((s, j) => ({ ...s, position: j })),
          })),
        },
        headers: auth(),
      });
      toast.success("Đã lưu lịch trình");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Lịch trình ({items.length} ngày)</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setItems((p) => [
                ...p,
                {
                  position: p.length,
                  date: "",
                  label: { ...emptyI18n },
                  topic_slugs: [],
                  speaker_external_ids: [],
                  sessions: [],
                },
              ])
            }
          >
            <Plus className="mr-1 h-4 w-4" /> Thêm ngày
          </Button>
          <Button size="sm" onClick={submit} disabled={saving}>
            <Save className="mr-1 h-4 w-4" /> Lưu
          </Button>
        </div>
      </div>

      {items.map((d, i) => (
        <Card key={i} className="p-4 bg-muted/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Ngày #{i + 1}</span>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => setItems((p) => move(p, i, -1))}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setItems((p) => move(p, i, 1))}>
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Ngày *</Label>
              <Input
                type="date"
                value={d.date}
                onChange={(e) =>
                  setItems((p) => p.map((x, idx) => (idx === i ? { ...x, date: e.target.value } : x)))
                }
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <I18nField
                label="Nhãn"
                value={d.label}
                onChange={(v) =>
                  setItems((p) => p.map((x, idx) => (idx === i ? { ...x, label: v } : x)))
                }
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Topic slugs</Label>
              <Input
                value={d.topic_slugs.join(", ")}
                onChange={(e) =>
                  setItems((p) =>
                    p.map((x, idx) =>
                      idx === i
                        ? {
                            ...x,
                            topic_slugs: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          }
                        : x
                    )
                  )
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Speaker external IDs</Label>
              <Input
                value={d.speaker_external_ids.join(", ")}
                onChange={(e) =>
                  setItems((p) =>
                    p.map((x, idx) =>
                      idx === i
                        ? {
                            ...x,
                            speaker_external_ids: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          }
                        : x
                    )
                  )
                }
              />
            </div>
          </div>

          <div className="border-t pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Phiên ({d.sessions.length})</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setItems((p) =>
                    p.map((x, idx) =>
                      idx === i
                        ? {
                            ...x,
                            sessions: [
                              ...x.sessions,
                              {
                                position: x.sessions.length,
                                time_text: "",
                                title: { ...emptyI18n },
                                description: { ...emptyI18n },
                                location: { ...emptyI18n },
                                tag: null,
                              },
                            ],
                          }
                        : x
                    )
                  )
                }
              >
                <Plus className="mr-1 h-4 w-4" /> Thêm phiên
              </Button>
            </div>
            {d.sessions.map((s, j) => (
              <Card key={j} className="p-3 space-y-2 bg-background">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Phiên #{j + 1}</span>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        setItems((p) =>
                          p.map((x, idx) =>
                            idx === i ? { ...x, sessions: move(x.sessions, j, -1) } : x
                          )
                        )
                      }
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        setItems((p) =>
                          p.map((x, idx) =>
                            idx === i ? { ...x, sessions: move(x.sessions, j, 1) } : x
                          )
                        )
                      }
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        setItems((p) =>
                          p.map((x, idx) =>
                            idx === i
                              ? { ...x, sessions: x.sessions.filter((_, jj) => jj !== j) }
                              : x
                          )
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Thời gian</Label>
                    <Input
                      placeholder="09:00 - 10:30"
                      value={s.time_text}
                      onChange={(e) =>
                        setItems((p) =>
                          p.map((x, idx) =>
                            idx === i
                              ? {
                                  ...x,
                                  sessions: x.sessions.map((ss, jj) =>
                                    jj === j ? { ...ss, time_text: e.target.value } : ss
                                  ),
                                }
                              : x
                          )
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-xs">Tag</Label>
                    <Input
                      value={s.tag ?? ""}
                      onChange={(e) =>
                        setItems((p) =>
                          p.map((x, idx) =>
                            idx === i
                              ? {
                                  ...x,
                                  sessions: x.sessions.map((ss, jj) =>
                                    jj === j ? { ...ss, tag: e.target.value || null } : ss
                                  ),
                                }
                              : x
                          )
                        )
                      }
                    />
                  </div>
                </div>
                <I18nField
                  label="Tiêu đề"
                  value={s.title}
                  onChange={(v) =>
                    setItems((p) =>
                      p.map((x, idx) =>
                        idx === i
                          ? {
                              ...x,
                              sessions: x.sessions.map((ss, jj) => (jj === j ? { ...ss, title: v } : ss)),
                            }
                          : x
                      )
                    )
                  }
                />
                <I18nField
                  label="Mô tả"
                  value={s.description}
                  textarea
                  onChange={(v) =>
                    setItems((p) =>
                      p.map((x, idx) =>
                        idx === i
                          ? {
                              ...x,
                              sessions: x.sessions.map((ss, jj) =>
                                jj === j ? { ...ss, description: v } : ss
                              ),
                            }
                          : x
                      )
                    )
                  }
                />
                <I18nField
                  label="Địa điểm"
                  value={s.location}
                  onChange={(v) =>
                    setItems((p) =>
                      p.map((x, idx) =>
                        idx === i
                          ? {
                              ...x,
                              sessions: x.sessions.map((ss, jj) =>
                                jj === j ? { ...ss, location: v } : ss
                              ),
                            }
                          : x
                      )
                    )
                  }
                />
              </Card>
            ))}
          </div>
        </Card>
      ))}
    </Card>
  );
}
