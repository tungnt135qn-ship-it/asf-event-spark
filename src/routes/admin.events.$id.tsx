import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  getEventDetail,
  updateEventGeneral,
  updateEventStatus,
  setDefaultEvent,
  upsertEventSettings,
  updateEventTheme,
} from "@/lib/event-admin.functions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { ArrowLeft, ExternalLink, Plus, Trash2, Save, Star } from "lucide-react";
import { toast } from "sonner";
import { ContentTab } from "@/components/admin/ContentTab";
import { ModulesTab } from "@/components/admin/ModulesTab";
import { ResourcesTab } from "@/components/admin/ResourcesTab";
import { ImageUpload } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/events/$id")({
  component: EventDetailPage,
});

type I18n = { vi: string; en: string };
type SocialLink = { platform: string; url: string; label?: string | null };

function EventDetailPage() {
  const { id } = Route.useParams();
  const { session } = useAdminAuth();
  const router = useRouter();

  const fetchDetail = useServerFn(getEventDetail);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-event-detail", id],
    queryFn: async () => {
      const token = session?.access_token;
      if (!token) throw new Error("Phiên đăng nhập không hợp lệ");
      return fetchDetail({
        data: { id },
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    enabled: Boolean(session?.access_token),
  });

  if (isLoading)
    return (
      <div className="p-10 text-muted-foreground text-sm">Đang tải sự kiện…</div>
    );

  if (isError || !data)
    return (
      <div className="p-10">
        <Card className="p-5 text-sm text-destructive">
          {error instanceof Error ? error.message : "Không tải được sự kiện."}
        </Card>
        <Button variant="outline" className="mt-4" onClick={() => router.navigate({ to: "/admin" })}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>
      </div>
    );

  const event = data.event as unknown as {
    id: string;
    slug: string;
    name: I18n;
    tagline: I18n;
    location: I18n;
    default_lang: "vi" | "en";
    start_at: string | null;
    end_at: string | null;
    status: "draft" | "published" | "archived";
    is_default: boolean;
    logo_url: string | null;
    cover_url: string | null;
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin">
            <ArrowLeft className="mr-1 h-4 w-4" /> Sự kiện
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold truncate">
            {event.name?.vi || event.name?.en || event.slug}
          </h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant={event.status === "published" ? "default" : "outline"}>
              {event.status}
            </Badge>
            {event.is_default && (
              <Badge variant="secondary">
                <Star className="mr-1 h-3 w-3" /> Mặc định
              </Badge>
            )}
            <a
              href={`/e/${event.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              /e/{event.slug} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        <StatusActions event={event} onChanged={() => refetch()} />
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="general">Thông tin chung</TabsTrigger>
          <TabsTrigger value="settings">Cấu hình</TabsTrigger>
          <TabsTrigger value="theme">Giao diện</TabsTrigger>
          <TabsTrigger value="content">Nội dung</TabsTrigger>
          <TabsTrigger value="modules">Module</TabsTrigger>
          <TabsTrigger value="resources">Tài nguyên</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <GeneralForm event={event} onSaved={() => refetch()} />
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <SettingsForm
            eventId={event.id}
            settings={data.settings as Record<string, unknown> | null}
            onSaved={() => refetch()}
          />
        </TabsContent>

        <TabsContent value="theme" className="mt-4">
          <ThemeForm
            eventId={event.id}
            theme={(data.event as unknown as { theme?: Record<string, unknown> }).theme ?? {}}
            onSaved={() => refetch()}
          />
        </TabsContent>

        <TabsContent value="content" className="mt-4">
          <ContentTab eventId={event.id} />
        </TabsContent>

        <TabsContent value="modules" className="mt-4">
          <ModulesTab eventId={event.id} />
        </TabsContent>

        <TabsContent value="resources" className="mt-4">
          <ResourcesTab eventId={event.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatusActions({
  event,
  onChanged,
}: {
  event: { id: string; status: "draft" | "published" | "archived"; is_default: boolean };
  onChanged: () => void;
}) {
  const { isSuperAdmin, session } = useAdminAuth();
  const [busy, setBusy] = useState(false);
  const setStatusFn = useServerFn(updateEventStatus);
  const setDefaultFn = useServerFn(setDefaultEvent);

  const auth = () => {
    const t = session?.access_token;
    if (!t) throw new Error("Phiên đăng nhập không hợp lệ");
    return { Authorization: `Bearer ${t}` };
  };

  const setStatus = async (status: "draft" | "published" | "archived") => {
    setBusy(true);
    try {
      await setStatusFn({ data: { id: event.id, status }, headers: auth() });
      toast.success(`Đã đổi trạng thái → ${status}`);
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Có lỗi xảy ra");
    } finally {
      setBusy(false);
    }
  };

  const setDefault = async () => {
    setBusy(true);
    try {
      await setDefaultFn({ data: { id: event.id }, headers: auth() });
      toast.success("Đã đặt làm sự kiện mặc định");
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Có lỗi xảy ra");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Select value={event.status} onValueChange={(v) => setStatus(v as never)} disabled={busy}>
        <SelectTrigger className="w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">draft</SelectItem>
          <SelectItem value="published">published</SelectItem>
          <SelectItem value="archived">archived</SelectItem>
        </SelectContent>
      </Select>
      {isSuperAdmin && !event.is_default && (
        <Button variant="outline" size="sm" onClick={setDefault} disabled={busy}>
          <Star className="mr-1 h-4 w-4" /> Đặt mặc định
        </Button>
      )}
    </div>
  );
}

function toLocalDateTime(value: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalDateTime(value: string): string | null {
  if (!value) return null;
  return new Date(value).toISOString();
}

function GeneralForm({
  event,
  onSaved,
}: {
  event: {
    id: string;
    slug: string;
    name: I18n;
    tagline: I18n;
    location: I18n;
    default_lang: "vi" | "en";
    start_at: string | null;
    end_at: string | null;
    logo_url: string | null;
    cover_url: string | null;
  };
  onSaved: () => void;
}) {
  const { session } = useAdminAuth();
  const updateFn = useServerFn(updateEventGeneral);
  const [form, setForm] = useState(event);
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(event), [event]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = session?.access_token;
    if (!token) {
      toast.error("Phiên đăng nhập không hợp lệ");
      return;
    }
    setSaving(true);
    try {
      await updateFn({
        data: {
          id: form.id,
          slug: form.slug.trim().toLowerCase(),
          name: form.name,
          tagline: form.tagline,
          location: form.location,
          default_lang: form.default_lang,
          start_at: form.start_at,
          end_at: form.end_at,
          logo_url: form.logo_url,
          cover_url: form.cover_url,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã lưu thông tin chung");
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
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              required
              pattern="[a-z0-9-]+"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Ngôn ngữ mặc định</Label>
            <Select
              value={form.default_lang}
              onValueChange={(v) => setForm({ ...form, default_lang: v as "vi" | "en" })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vi">Tiếng Việt</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <I18nField
          label="Tên sự kiện"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />
        <I18nField
          label="Tagline"
          value={form.tagline}
          onChange={(v) => setForm({ ...form, tagline: v })}
          textarea
        />
        <I18nField
          label="Địa điểm"
          value={form.location}
          onChange={(v) => setForm({ ...form, location: v })}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Bắt đầu</Label>
            <Input
              type="datetime-local"
              value={toLocalDateTime(form.start_at)}
              onChange={(e) => setForm({ ...form, start_at: fromLocalDateTime(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Kết thúc</Label>
            <Input
              type="datetime-local"
              value={toLocalDateTime(form.end_at)}
              onChange={(e) => setForm({ ...form, end_at: fromLocalDateTime(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Logo</Label>
            <ImageUpload
              value={form.logo_url}
              onChange={(url) => setForm({ ...form, logo_url: url })}
              folder="events/logo"
            />
          </div>
          <div className="space-y-2">
            <Label>Ảnh bìa (cover)</Label>
            <ImageUpload
              value={form.cover_url}
              onChange={(url) => setForm({ ...form, cover_url: url })}
              folder="events/cover"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Đang lưu…" : "Lưu"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

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
          <div className="text-[11px] uppercase text-muted-foreground mb-1">Tiếng Việt</div>
          <Field
            value={value?.vi ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              onChange({ ...value, vi: e.target.value })
            }
          />
        </div>
        <div>
          <div className="text-[11px] uppercase text-muted-foreground mb-1">English</div>
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

type SeoState = {
  title_vi?: string | null;
  title_en?: string | null;
  description_vi?: string | null;
  description_en?: string | null;
  keywords?: string | null;
  og_image?: string | null;
};

type SettingsState = {
  registration_enabled: boolean;
  booking_enabled: boolean;
  documents_locked: boolean;
  library_locked: boolean;
  footer_text: I18n;
  contact: {
    email?: string | null;
    phone?: string | null;
    address_vi?: string | null;
    address_en?: string | null;
  };
  social_links: SocialLink[];
  seo: SeoState;
};

const emptySettings: SettingsState = {
  registration_enabled: true,
  booking_enabled: true,
  documents_locked: false,
  library_locked: false,
  footer_text: { vi: "", en: "" },
  contact: {},
  social_links: [],
  seo: {},
};

function SettingsForm({
  eventId,
  settings,
  onSaved,
}: {
  eventId: string;
  settings: Record<string, unknown> | null;
  onSaved: () => void;
}) {
  const { session } = useAdminAuth();
  const upsertFn = useServerFn(upsertEventSettings);
  const [saving, setSaving] = useState(false);

  const initial: SettingsState = settings
    ? {
        registration_enabled: Boolean(settings.registration_enabled ?? true),
        booking_enabled: Boolean(settings.booking_enabled ?? true),
        documents_locked: Boolean(settings.documents_locked ?? false),
        library_locked: Boolean(settings.library_locked ?? false),
        footer_text: (settings.footer_text as I18n) ?? { vi: "", en: "" },
        contact: (settings.contact as SettingsState["contact"]) ?? {},
        social_links: ((settings.social_links as SocialLink[]) ?? []) || [],
      }
    : emptySettings;

  const [form, setForm] = useState<SettingsState>(initial);

  useEffect(() => setForm(initial), [eventId]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = session?.access_token;
    if (!token) {
      toast.error("Phiên đăng nhập không hợp lệ");
      return;
    }
    setSaving(true);
    try {
      await upsertFn({
        data: {
          event_id: eventId,
          registration_enabled: form.registration_enabled,
          booking_enabled: form.booking_enabled,
          documents_locked: form.documents_locked,
          library_locked: form.library_locked,
          footer_text: form.footer_text,
          contact: form.contact,
          social_links: form.social_links,
          seo: (settings?.seo as Record<string, unknown>) ?? {},
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã lưu cấu hình");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const updateSocial = (idx: number, patch: Partial<SocialLink>) => {
    setForm({
      ...form,
      social_links: form.social_links.map((s, i) => (i === idx ? { ...s, ...patch } : s)),
    });
  };

  return (
    <Card className="p-6">
      <form onSubmit={submit} className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Trạng thái module
          </h3>
          <ToggleRow
            label="Cho phép đăng ký"
            value={form.registration_enabled}
            onChange={(v) => setForm({ ...form, registration_enabled: v })}
          />
          <ToggleRow
            label="Cho phép đặt khách sạn"
            value={form.booking_enabled}
            onChange={(v) => setForm({ ...form, booking_enabled: v })}
          />
          <ToggleRow
            label="Khoá Tài liệu (yêu cầu access code)"
            value={form.documents_locked}
            onChange={(v) => setForm({ ...form, documents_locked: v })}
          />
          <ToggleRow
            label="Khoá Thư viện (yêu cầu access code)"
            value={form.library_locked}
            onChange={(v) => setForm({ ...form, library_locked: v })}
          />
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Liên hệ
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={form.contact.email ?? ""}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, email: e.target.value || null } })}
              />
            </div>
            <div className="space-y-2">
              <Label>Điện thoại</Label>
              <Input
                value={form.contact.phone ?? ""}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, phone: e.target.value || null } })}
              />
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ (VI)</Label>
              <Input
                value={form.contact.address_vi ?? ""}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, address_vi: e.target.value || null } })}
              />
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ (EN)</Label>
              <Input
                value={form.contact.address_en ?? ""}
                onChange={(e) => setForm({ ...form, contact: { ...form.contact, address_en: e.target.value || null } })}
              />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <I18nField
            label="Footer text"
            value={form.footer_text}
            onChange={(v) => setForm({ ...form, footer_text: v })}
            textarea
          />
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Mạng xã hội
            </h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                setForm({
                  ...form,
                  social_links: [...form.social_links, { platform: "", url: "" }],
                })
              }
            >
              <Plus className="mr-1 h-4 w-4" /> Thêm
            </Button>
          </div>
          {form.social_links.length === 0 && (
            <p className="text-sm text-muted-foreground">Chưa có liên kết.</p>
          )}
          {form.social_links.map((s, idx) => (
            <div key={idx} className="grid md:grid-cols-[160px_1fr_auto] gap-2 items-end">
              <div>
                <Label className="text-xs">Platform</Label>
                <Input
                  value={s.platform}
                  placeholder="facebook / linkedin / x …"
                  onChange={(e) => updateSocial(idx, { platform: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs">URL</Label>
                <Input
                  value={s.url}
                  placeholder="https://…"
                  onChange={(e) => updateSocial(idx, { url: e.target.value })}
                />
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() =>
                  setForm({
                    ...form,
                    social_links: form.social_links.filter((_, i) => i !== idx),
                  })
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </section>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Đang lưu…" : "Lưu cấu hình"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <div className="text-sm">{label}</div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

function ThemeForm({
  eventId,
  theme,
  onSaved,
}: {
  eventId: string;
  theme: Record<string, unknown>;
  onSaved: () => void;
}) {
  const { session } = useAdminAuth();
  const updateFn = useServerFn(updateEventTheme);
  const [form, setForm] = useState({
    primary: (theme.primary as string) ?? "#C8A45D",
    accent: (theme.accent as string) ?? "#1A1F2E",
    animations: (theme.animations as Record<string, string>) ?? {},
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = session?.access_token;
    if (!token) return toast.error("Phiên không hợp lệ");
    setSaving(true);
    try {
      await updateFn({
        data: { id: eventId, theme: form },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã lưu giao diện");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Có lỗi");
    } finally {
      setSaving(false);
    }
  };

  const setAnim = (key: string, url: string | null) =>
    setForm({ ...form, animations: { ...form.animations, [key]: url ?? "" } });

  return (
    <Card className="p-6">
      <form onSubmit={submit} className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Màu sắc</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Màu chính (primary)</Label>
              <div className="flex gap-2">
                <Input type="color" className="h-10 w-16 p-1" value={form.primary} onChange={(e) => setForm({ ...form, primary: e.target.value })} />
                <Input value={form.primary} onChange={(e) => setForm({ ...form, primary: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Màu phụ (accent)</Label>
              <div className="flex gap-2">
                <Input type="color" className="h-10 w-16 p-1" value={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.value })} />
                <Input value={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.value })} />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Animation (.lottie)</h3>
          <div className="space-y-3">
            <div className="space-y-1"><Label>Signup</Label>
              <ImageUpload value={form.animations.signup} onChange={(u) => setAnim("signup", u)} folder="theme/animations" accept=".lottie,application/zip" />
            </div>
            <div className="space-y-1"><Label>Call ringing</Label>
              <ImageUpload value={form.animations.call} onChange={(u) => setAnim("call", u)} folder="theme/animations" accept=".lottie,application/zip" />
            </div>
            <div className="space-y-1"><Label>FAQ chatbot</Label>
              <ImageUpload value={form.animations.faq} onChange={(u) => setAnim("faq", u)} folder="theme/animations" accept=".lottie,application/zip" />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}><Save className="mr-2 h-4 w-4" />{saving ? "Đang lưu…" : "Lưu giao diện"}</Button>
        </div>
      </form>
    </Card>
  );
}
