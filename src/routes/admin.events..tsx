
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
