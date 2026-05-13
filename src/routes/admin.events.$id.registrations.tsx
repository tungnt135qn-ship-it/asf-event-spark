import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  listRegistrations,
  deleteRegistration,
} from "@/lib/event-submissions-admin.functions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Download, Eye, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { RegistrationStats } from "@/components/admin/StatsCharts";

export const Route = createFileRoute("/admin/events/$id/registrations")({
  component: RegistrationsPage,
});

type Row = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  job_title: string | null;
  nationality: string | null;
  country_code: string | null;
  language: string | null;
  customer_type: string | null;
  access_code: string | null;
  notes: string | null;
  passport_url: string | null;
  submitted_at: string;
  raw: Record<string, unknown>;
};

function RegistrationsPage() {
  const { id } = Route.useParams();
  const { session } = useAdminAuth();
  const fetchList = useServerFn(listRegistrations);
  const delFn = useServerFn(deleteRegistration);

  const auth = () => {
    const t = session?.access_token;
    if (!t) throw new Error("Phiên đăng nhập không hợp lệ");
    return { Authorization: `Bearer ${t}` };
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-registrations", id],
    queryFn: async () =>
      fetchList({ data: { event_id: id }, headers: auth() }),
    enabled: Boolean(session?.access_token),
  });

  const [q, setQ] = useState("");
  const [code, setCode] = useState("");
  const [view, setView] = useState<Row | null>(null);

  const rows = (data?.rows ?? []) as Row[];

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (code && (r.access_code || "") !== code) return false;
      if (!qq) return true;
      return [r.full_name, r.email, r.phone, r.organization, r.nationality]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(qq));
    });
  }, [rows, q, code]);

  const codes = useMemo(
    () =>
      Array.from(new Set(rows.map((r) => r.access_code).filter(Boolean))) as string[],
    [rows]
  );

  const stats = useMemo(() => {
    const byDay = new Map<string, number>();
    const byNat = new Map<string, number>();
    rows.forEach((r) => {
      const d = (r.submitted_at || "").slice(0, 10);
      byDay.set(d, (byDay.get(d) ?? 0) + 1);
      const n = r.nationality || "—";
      byNat.set(n, (byNat.get(n) ?? 0) + 1);
    });
    return {
      total: rows.length,
      today: byDay.get(new Date().toISOString().slice(0, 10)) ?? 0,
      topNat: [...byNat.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3),
    };
  }, [rows]);

  const exportCsv = () => {
    const headers = [
      "submitted_at",
      "full_name",
      "email",
      "phone",
      "organization",
      "job_title",
      "nationality",
      "country_code",
      "customer_type",
      "language",
      "access_code",
      "notes",
    ];
    const escape = (v: unknown) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [
      headers.join(","),
      ...filtered.map((r) =>
        headers.map((h) => escape((r as unknown as Record<string, unknown>)[h])).join(",")
      ),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${id}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onDelete = async (rowId: string) => {
    if (!confirm("Xoá đăng ký này?")) return;
    try {
      await delFn({ data: { id: rowId }, headers: auth() });
      toast.success("Đã xoá");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Có lỗi");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin/events/$id" params={{ id }}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Sự kiện
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Đăng ký tham dự</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tổng {stats.total} • Hôm nay {stats.today}
            {stats.topNat.length > 0 && (
              <>
                {" "}
                • Top quốc tịch:{" "}
                {stats.topNat.map(([n, c]) => `${n} (${c})`).join(", ")}
              </>
            )}
          </p>
        </div>
        <Button onClick={exportCsv} variant="outline">
          <Download className="mr-2 h-4 w-4" /> Xuất CSV
        </Button>
      </div>

      <Card className="p-4 mb-4">
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên, email, SĐT, tổ chức…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">Tất cả access code</option>
            {codes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-sm text-muted-foreground">Đang tải…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-sm text-muted-foreground">Chưa có dữ liệu.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3 font-medium">Thời gian</th>
                  <th className="p-3 font-medium">Họ tên</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">SĐT</th>
                  <th className="p-3 font-medium">Tổ chức</th>
                  <th className="p-3 font-medium">Quốc tịch</th>
                  <th className="p-3 font-medium">Code</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-muted/30">
                    <td className="p-3 whitespace-nowrap text-muted-foreground">
                      {new Date(r.submitted_at).toLocaleString("vi-VN")}
                    </td>
                    <td className="p-3 font-medium">{r.full_name}</td>
                    <td className="p-3">{r.email}</td>
                    <td className="p-3">{r.phone ?? "—"}</td>
                    <td className="p-3">{r.organization ?? "—"}</td>
                    <td className="p-3">{r.nationality ?? "—"}</td>
                    <td className="p-3">
                      {r.access_code ? (
                        <Badge variant="secondary">{r.access_code}</Badge>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setView(r)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(r.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog open={Boolean(view)} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đăng ký</DialogTitle>
          </DialogHeader>
          {view && (
            <div className="space-y-3 text-sm">
              <Field label="Họ tên" value={view.full_name} />
              <Field label="Email" value={view.email} />
              <Field label="SĐT" value={view.phone} />
              <Field label="Tổ chức" value={view.organization} />
              <Field label="Chức vụ" value={view.job_title} />
              <Field label="Quốc tịch" value={view.nationality} />
              <Field label="Loại khách" value={view.customer_type} />
              <Field label="Ngôn ngữ" value={view.language} />
              <Field label="Access code" value={view.access_code} />
              <Field label="Ghi chú" value={view.notes} />
              {view.passport_url && (
                <div>
                  <div className="text-xs text-muted-foreground">Passport</div>
                  <a
                    href={view.passport_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {view.passport_url}
                  </a>
                </div>
              )}
              <div>
                <div className="text-xs text-muted-foreground mb-1">Raw</div>
                <pre className="bg-muted rounded-md p-3 text-xs overflow-auto max-h-60">
                  {JSON.stringify(view.raw, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="col-span-2">{value || "—"}</div>
    </div>
  );
}
