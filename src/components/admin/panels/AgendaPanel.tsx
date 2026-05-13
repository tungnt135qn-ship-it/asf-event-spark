import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useAdminAuth } from "@/lib/admin-auth";
import { getEventModulesAdmin } from "@/lib/event-modules-admin.functions";
import {
  upsertAgendaDay,
  deleteAgendaDay,
  upsertAgendaSession,
  deleteAgendaSession,
} from "@/lib/event-items-admin.functions";
import { CrudListPage, CrudColumn } from "@/components/admin/CrudListPage";
import { FormDialog, I18n, I18nField, ReadonlyI18n, emptyI18n } from "@/components/admin/panels/_shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type DayRow = { id: string; date: string; label: I18n; topic_slugs: string[]; speaker_external_ids: string[] };
type SessionRow = {
  id: string;
  day_id: string;
  time_text: string;
  title: I18n;
  description: I18n;
  location: I18n;
  tag: string | null;
};
type Mode = "create" | "edit" | "view";

const emptyDay: DayRow = { id: "", date: "", label: { ...emptyI18n }, topic_slugs: [], speaker_external_ids: [] };
const emptySession: SessionRow = {
  id: "",
  day_id: "",
  time_text: "",
  title: { ...emptyI18n },
  description: { ...emptyI18n },
  location: { ...emptyI18n },
  tag: null,
};

export function AgendaPanel({ eventId }: { eventId: string }) {
  const { session } = useAdminAuth();
  const fetchAll = useServerFn(getEventModulesAdmin);
  const upsertDay = useServerFn(upsertAgendaDay);
  const removeDay = useServerFn(deleteAgendaDay);
  const upsertSession = useServerFn(upsertAgendaSession);
  const removeSession = useServerFn(deleteAgendaSession);
  const auth = () => ({ Authorization: `Bearer ${session?.access_token}` });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-event-modules", eventId],
    queryFn: () => fetchAll({ data: { event_id: eventId }, headers: auth() }),
    enabled: Boolean(session?.access_token),
  });

  const days = useMemo<DayRow[]>(
    () =>
      ((data?.agenda_days ?? []) as Record<string, unknown>[]).map((d) => ({
        id: d.id as string,
        date: (d.date as string) ?? "",
        label: (d.label as I18n) ?? emptyI18n,
        topic_slugs: (d.topic_slugs as string[]) ?? [],
        speaker_external_ids: (d.speaker_external_ids as string[]) ?? [],
      })),
    [data]
  );
  const sessions = useMemo<SessionRow[]>(
    () =>
      ((data?.agenda_sessions ?? []) as Record<string, unknown>[]).map((s) => ({
        id: s.id as string,
        day_id: s.day_id as string,
        time_text: (s.time_text as string) ?? "",
        title: (s.title as I18n) ?? emptyI18n,
        description: (s.description as I18n) ?? emptyI18n,
        location: (s.location as I18n) ?? emptyI18n,
        tag: (s.tag as string) ?? null,
      })),
    [data]
  );

  // Day dialog
  const [dayOpen, setDayOpen] = useState(false);
  const [dayMode, setDayMode] = useState<Mode>("create");
  const [dayForm, setDayForm] = useState<DayRow>(emptyDay);
  const [daySaving, setDaySaving] = useState(false);
  useEffect(() => { if (!dayOpen) setDayForm(emptyDay); }, [dayOpen]);

  const submitDay = async () => {
    if (!dayForm.date) { toast.error("Ngày bắt buộc"); return; }
    setDaySaving(true);
    try {
      await upsertDay({
        data: {
          id: dayMode === "edit" && dayForm.id ? dayForm.id : undefined,
          event_id: eventId,
          date: dayForm.date,
          label: dayForm.label,
          topic_slugs: dayForm.topic_slugs,
          speaker_external_ids: dayForm.speaker_external_ids,
        },
        headers: auth(),
      });
      toast.success(dayMode === "edit" ? "Đã cập nhật ngày" : "Đã tạo ngày");
      setDayOpen(false);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setDaySaving(false);
    }
  };

  const deleteDayRow = async (r: DayRow) => {
    try {
      await removeDay({ data: { id: r.id, event_id: eventId }, headers: auth() });
      toast.success("Đã xoá ngày (và buổi liên quan)");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    }
  };

  // Session dialog
  const [sesOpen, setSesOpen] = useState(false);
  const [sesMode, setSesMode] = useState<Mode>("create");
  const [sesForm, setSesForm] = useState<SessionRow>(emptySession);
  const [sesSaving, setSesSaving] = useState(false);
  useEffect(() => { if (!sesOpen) setSesForm(emptySession); }, [sesOpen]);

  const submitSession = async () => {
    if (!sesForm.day_id) { toast.error("Chọn ngày"); return; }
    if (!sesForm.title.vi.trim() && !sesForm.title.en.trim()) { toast.error("Tiêu đề bắt buộc"); return; }
    setSesSaving(true);
    try {
      await upsertSession({
        data: {
          id: sesMode === "edit" && sesForm.id ? sesForm.id : undefined,
          event_id: eventId,
          day_id: sesForm.day_id,
          time_text: sesForm.time_text,
          title: sesForm.title,
          description: sesForm.description,
          location: sesForm.location,
          tag: sesForm.tag,
        },
        headers: auth(),
      });
      toast.success(sesMode === "edit" ? "Đã cập nhật buổi" : "Đã tạo buổi");
      setSesOpen(false);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSesSaving(false);
    }
  };

  const deleteSessionRow = async (r: SessionRow) => {
    try {
      await removeSession({ data: { id: r.id, event_id: eventId }, headers: auth() });
      toast.success("Đã xoá buổi");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    }
  };

  const dayColumns: CrudColumn<DayRow>[] = [
    { key: "date", header: "Ngày", render: (r) => <div className="font-medium">{r.date}</div> },
    { key: "label", header: "Nhãn", render: (r) => r.label.vi || r.label.en || "—" },
    {
      key: "sessions",
      header: "Buổi",
      render: (r) => <Badge variant="secondary">{sessions.filter((s) => s.day_id === r.id).length}</Badge>,
    },
  ];

  const sessionColumns: CrudColumn<SessionRow>[] = [
    {
      key: "day",
      header: "Ngày",
      render: (r) => {
        const d = days.find((x) => x.id === r.day_id);
        return d ? <span className="text-xs">{d.date}</span> : "—";
      },
    },
    { key: "time", header: "Giờ", render: (r) => <span className="font-mono text-xs">{r.time_text || "—"}</span> },
    { key: "title", header: "Tiêu đề", render: (r) => <div className="font-medium truncate">{r.title.vi || r.title.en || "—"}</div> },
    { key: "loc", header: "Địa điểm", render: (r) => <span className="text-xs text-muted-foreground">{r.location.vi || r.location.en || "—"}</span> },
    { key: "tag", header: "Tag", render: (r) => (r.tag ? <Badge variant="outline">{r.tag}</Badge> : "—") },
  ];

  const sortedSessions = useMemo(() => {
    const dayOrder = new Map(days.map((d, i) => [d.id, i]));
    return [...sessions].sort((a, b) => {
      const da = dayOrder.get(a.day_id) ?? 999;
      const db = dayOrder.get(b.day_id) ?? 999;
      if (da !== db) return da - db;
      return a.time_text.localeCompare(b.time_text);
    });
  }, [sessions, days]);

  return (
    <div className="space-y-6">
      <CrudListPage<DayRow>
        title="Lịch trình — Ngày"
        description="Mỗi ngày có nhiều buổi/session"
        loading={isLoading}
        rows={days}
        columns={dayColumns}
        searchAccessor={(r) => `${r.date} ${r.label.vi} ${r.label.en}`}
        onCreate={() => { setDayMode("create"); setDayForm(emptyDay); setDayOpen(true); }}
        onView={(r) => { setDayMode("view"); setDayForm(r); setDayOpen(true); }}
        onEdit={(r) => { setDayMode("edit"); setDayForm(r); setDayOpen(true); }}
        onDelete={deleteDayRow}
      />

      <CrudListPage<SessionRow>
        title="Lịch trình — Buổi"
        description="Các buổi/session theo từng ngày"
        loading={isLoading}
        rows={sortedSessions}
        columns={sessionColumns}
        searchAccessor={(r) => `${r.title.vi} ${r.title.en} ${r.tag ?? ""} ${r.time_text}`}
        onCreate={() => {
          if (days.length === 0) { toast.error("Tạo ngày trước"); return; }
          setSesMode("create"); setSesForm({ ...emptySession, day_id: days[0].id }); setSesOpen(true);
        }}
        onView={(r) => { setSesMode("view"); setSesForm(r); setSesOpen(true); }}
        onEdit={(r) => { setSesMode("edit"); setSesForm(r); setSesOpen(true); }}
        onDelete={deleteSessionRow}
      />

      {/* Day dialog */}
      <FormDialog
        open={dayOpen}
        onOpenChange={setDayOpen}
        title={dayMode === "create" ? "Tạo ngày" : dayMode === "edit" ? "Sửa ngày" : "Xem ngày"}
        readOnly={dayMode === "view"}
        saving={daySaving}
        onSubmit={submitDay}
      >
        {dayMode === "view" ? (
          <>
            <div className="text-sm"><strong>Ngày:</strong> {dayForm.date}</div>
            <ReadonlyI18n label="Nhãn" value={dayForm.label} />
            <div className="text-xs text-muted-foreground">Topic slugs: {dayForm.topic_slugs.join(", ") || "—"}</div>
            <div className="text-xs text-muted-foreground">Speaker IDs: {dayForm.speaker_external_ids.join(", ") || "—"}</div>
          </>
        ) : (
          <>
            <div>
              <Label className="text-xs">Ngày *</Label>
              <Input type="date" value={dayForm.date} onChange={(e) => setDayForm({ ...dayForm, date: e.target.value })} />
            </div>
            <I18nField label="Nhãn (vd: Ngày 1)" value={dayForm.label} onChange={(v) => setDayForm({ ...dayForm, label: v })} />
            <div>
              <Label className="text-xs">Topic slugs (cách bằng dấu phẩy)</Label>
              <Input
                value={dayForm.topic_slugs.join(", ")}
                onChange={(e) => setDayForm({ ...dayForm, topic_slugs: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
              />
            </div>
            <div>
              <Label className="text-xs">Speaker external IDs (cách bằng dấu phẩy)</Label>
              <Input
                value={dayForm.speaker_external_ids.join(", ")}
                onChange={(e) => setDayForm({ ...dayForm, speaker_external_ids: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
              />
            </div>
          </>
        )}
      </FormDialog>

      {/* Session dialog */}
      <FormDialog
        open={sesOpen}
        onOpenChange={setSesOpen}
        title={sesMode === "create" ? "Tạo buổi" : sesMode === "edit" ? "Sửa buổi" : "Xem buổi"}
        readOnly={sesMode === "view"}
        saving={sesSaving}
        onSubmit={submitSession}
        size="lg"
      >
        {sesMode === "view" ? (
          <>
            <div className="text-sm">
              <strong>Ngày:</strong> {days.find((d) => d.id === sesForm.day_id)?.date || "—"} ·{" "}
              <strong>Giờ:</strong> {sesForm.time_text || "—"} {sesForm.tag && <Badge className="ml-2">{sesForm.tag}</Badge>}
            </div>
            <ReadonlyI18n label="Tiêu đề" value={sesForm.title} />
            <ReadonlyI18n label="Mô tả" value={sesForm.description} rich />
            <ReadonlyI18n label="Địa điểm" value={sesForm.location} />
          </>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Ngày *</Label>
                <Select value={sesForm.day_id} onValueChange={(v) => setSesForm({ ...sesForm, day_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Chọn ngày" /></SelectTrigger>
                  <SelectContent>
                    {days.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.date} — {d.label.vi || d.label.en || ""}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Giờ (vd: 09:00 – 10:30)</Label>
                <Input value={sesForm.time_text} onChange={(e) => setSesForm({ ...sesForm, time_text: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Tag</Label>
                <Input value={sesForm.tag ?? ""} onChange={(e) => setSesForm({ ...sesForm, tag: e.target.value || null })} />
              </div>
            </div>
            <I18nField label="Tiêu đề *" value={sesForm.title} onChange={(v) => setSesForm({ ...sesForm, title: v })} />
            <I18nField label="Mô tả" value={sesForm.description} rich onChange={(v) => setSesForm({ ...sesForm, description: v })} />
            <I18nField label="Địa điểm" value={sesForm.location} onChange={(v) => setSesForm({ ...sesForm, location: v })} />
          </>
        )}
      </FormDialog>
    </div>
  );
}
