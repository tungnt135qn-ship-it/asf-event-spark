import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useAdminAuth } from "@/lib/admin-auth";
import { getEventModulesAdmin } from "@/lib/event-modules-admin.functions";
import { upsertFaq, deleteFaq } from "@/lib/event-items-admin.functions";
import { CrudListPage, CrudColumn } from "@/components/admin/CrudListPage";
import { FormDialog, I18n, I18nField, ReadonlyI18n, emptyI18n } from "@/components/admin/panels/_shared";

type FaqRow = { id: string; category: I18n; question: I18n; answer: I18n };
type Mode = "create" | "edit" | "view";

const empty: FaqRow = { id: "", category: { ...emptyI18n }, question: { ...emptyI18n }, answer: { ...emptyI18n } };

export function FaqsPanel({ eventId }: { eventId: string }) {
  const { session } = useAdminAuth();
  const fetchAll = useServerFn(getEventModulesAdmin);
  const upsertFn = useServerFn(upsertFaq);
  const deleteFn = useServerFn(deleteFaq);
  const auth = () => ({ Authorization: `Bearer ${session?.access_token}` });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-event-modules", eventId],
    queryFn: () => fetchAll({ data: { event_id: eventId }, headers: auth() }),
    enabled: Boolean(session?.access_token),
  });

  const rows = useMemo<FaqRow[]>(
    () =>
      ((data?.faqs ?? []) as Record<string, unknown>[]).map((r) => ({
        id: r.id as string,
        category: (r.category as I18n) ?? emptyI18n,
        question: (r.question as I18n) ?? emptyI18n,
        answer: (r.answer as I18n) ?? emptyI18n,
      })),
    [data]
  );

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [form, setForm] = useState<FaqRow>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) setForm(empty);
  }, [open]);

  const openCreate = () => { setMode("create"); setForm(empty); setOpen(true); };
  const openEdit = (r: FaqRow) => { setMode("edit"); setForm(r); setOpen(true); };
  const openView = (r: FaqRow) => { setMode("view"); setForm(r); setOpen(true); };

  const submit = async () => {
    if (!form.question.vi.trim()) {
      toast.error("Câu hỏi (VI) bắt buộc");
      return;
    }
    setSaving(true);
    try {
      await upsertFn({
        data: {
          id: mode === "edit" && form.id ? form.id : undefined,
          event_id: eventId,
          category: form.category,
          question: form.question,
          answer: form.answer,
        },
        headers: auth(),
      });
      toast.success(mode === "edit" ? "Đã cập nhật" : "Đã tạo FAQ");
      setOpen(false);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r: FaqRow) => {
    try {
      await deleteFn({ data: { id: r.id, event_id: eventId }, headers: auth() });
      toast.success("Đã xoá");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi");
    }
  };

  const columns: CrudColumn<FaqRow>[] = [
    { key: "q", header: "Câu hỏi", render: (r) => <div className="font-medium truncate max-w-md">{r.question.vi || r.question.en}</div> },
    { key: "cat", header: "Danh mục", render: (r) => r.category.vi || r.category.en || "—" },
  ];

  return (
    <>
      <CrudListPage<FaqRow>
        title="FAQ"
        description="Câu hỏi thường gặp"
        loading={isLoading}
        rows={rows}
        columns={columns}
        searchAccessor={(r) => `${r.question.vi} ${r.question.en} ${r.category.vi} ${r.category.en}`}
        onCreate={openCreate}
        onView={openView}
        onEdit={openEdit}
        onDelete={remove}
      />

      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={mode === "create" ? "Tạo FAQ" : mode === "edit" ? "Sửa FAQ" : "Xem FAQ"}
        readOnly={mode === "view"}
        saving={saving}
        onSubmit={submit}
      >
        {mode === "view" ? (
          <>
            <ReadonlyI18n label="Danh mục" value={form.category} />
            <ReadonlyI18n label="Câu hỏi" value={form.question} />
            <ReadonlyI18n label="Trả lời" value={form.answer} rich />
          </>
        ) : (
          <>
            <I18nField label="Danh mục" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
            <I18nField label="Câu hỏi *" value={form.question} onChange={(v) => setForm({ ...form, question: v })} />
            <I18nField label="Trả lời" value={form.answer} rich onChange={(v) => setForm({ ...form, answer: v })} />
          </>
        )}
      </FormDialog>
    </>
  );
}
