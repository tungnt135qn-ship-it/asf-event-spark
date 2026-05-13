import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  listBookings,
  updateBookingStatus,
  deleteBooking,
} from "@/lib/event-submissions-admin.functions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Download, Eye, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/events/$id/bookings")({
  component: BookingsPage,
});

type Row = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  hotel_id: string | null;
  hotel_name: string | null;
  room_type: string | null;
  rooms: number | null;
  guests: number | null;
  check_in: string | null;
  check_out: string | null;
  access_code: string | null;
  notes: string | null;
  status: "pending" | "confirmed" | "cancelled" | string;
  submitted_at: string;
  raw: Record<string, unknown>;
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  confirmed: "default",
  cancelled: "destructive",
};

function BookingsPage() {
  const { id } = Route.useParams();
  const { session } = useAdminAuth();
  const fetchList = useServerFn(listBookings);
  const updFn = useServerFn(updateBookingStatus);
  const delFn = useServerFn(deleteBooking);

  const auth = () => {
    const t = session?.access_token;
    if (!t) throw new Error("Phiên đăng nhập không hợp lệ");
    return { Authorization: `Bearer ${t}` };
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-bookings", id],
    queryFn: async () =>
      fetchList({ data: { event_id: id }, headers: auth() }),
    enabled: Boolean(session?.access_token),
  });

  const [q, setQ] = useState("");
  const [hotel, setHotel] = useState("");
  const [status, setStatus] = useState("");
  const [view, setView] = useState<Row | null>(null);

  const rows = (data?.rows ?? []) as Row[];
  const hotels = data?.hotels ?? [];

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (hotel && (r.hotel_id || r.hotel_name || "") !== hotel) return false;
      if (status && r.status !== status) return false;
      if (!qq) return true;
      return [r.full_name, r.email, r.phone, r.organization, r.hotel_name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(qq));
    });
  }, [rows, q, hotel, status]);

  const stats = useMemo(() => {
    const byStatus = new Map<string, number>();
    const byHotel = new Map<string, number>();
    rows.forEach((r) => {
      byStatus.set(r.status, (byStatus.get(r.status) ?? 0) + 1);
      const h = r.hotel_name || "—";
      byHotel.set(h, (byHotel.get(h) ?? 0) + 1);
    });
    return {
      total: rows.length,
      pending: byStatus.get("pending") ?? 0,
      confirmed: byStatus.get("confirmed") ?? 0,
      cancelled: byStatus.get("cancelled") ?? 0,
      topHotels: [...byHotel.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3),
    };
  }, [rows]);

  const exportCsv = () => {
    const headers = [
      "submitted_at",
      "status",
      "full_name",
      "email",
      "phone",
      "organization",
      "hotel_name",
      "room_type",
      "rooms",
      "guests",
      "check_in",
      "check_out",
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
        headers
          .map((h) => escape((r as unknown as Record<string, unknown>)[h]))
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${id}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onStatus = async (rowId: string, s: string) => {
    try {
      await updFn({
        data: { id: rowId, status: s as "pending" | "confirmed" | "cancelled" },
        headers: auth(),
      });
      toast.success("Đã cập nhật");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Có lỗi");
    }
  };

  const onDelete = async (rowId: string) => {
    if (!confirm("Xoá yêu cầu đặt phòng này?")) return;
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
          <h1 className="text-2xl md:text-3xl font-bold">Đặt phòng khách sạn</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tổng {stats.total} • Chờ {stats.pending} • Xác nhận {stats.confirmed} •
            Huỷ {stats.cancelled}
            {stats.topHotels.length > 0 && (
              <>
                {" "}
                • Top hotel:{" "}
                {stats.topHotels.map(([n, c]) => `${n} (${c})`).join(", ")}
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
            value={hotel}
            onChange={(e) => setHotel(e.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">Tất cả khách sạn</option>
            {hotels.map((h: { id: string; name: string }) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">Mọi trạng thái</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
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
                  <th className="p-3 font-medium">Khách sạn</th>
                  <th className="p-3 font-medium">Phòng</th>
                  <th className="p-3 font-medium">Check-in/out</th>
                  <th className="p-3 font-medium">Trạng thái</th>
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
                    <td className="p-3">{r.hotel_name ?? "—"}</td>
                    <td className="p-3">
                      {r.room_type ?? "—"}
                      {r.rooms ? ` · ${r.rooms}p` : ""}
                      {r.guests ? ` · ${r.guests}k` : ""}
                    </td>
                    <td className="p-3 whitespace-nowrap text-xs">
                      {r.check_in ?? "—"} → {r.check_out ?? "—"}
                    </td>
                    <td className="p-3">
                      <Select
                        value={r.status}
                        onValueChange={(v) => onStatus(r.id, v)}
                      >
                        <SelectTrigger className="h-8 w-[130px]">
                          <SelectValue>
                            <Badge variant={STATUS_VARIANT[r.status] ?? "outline"}>
                              {r.status}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">pending</SelectItem>
                          <SelectItem value="confirmed">confirmed</SelectItem>
                          <SelectItem value="cancelled">cancelled</SelectItem>
                        </SelectContent>
                      </Select>
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
            <DialogTitle>Chi tiết đặt phòng</DialogTitle>
          </DialogHeader>
          {view && (
            <div className="space-y-3 text-sm">
              <Field label="Họ tên" value={view.full_name} />
              <Field label="Email" value={view.email} />
              <Field label="SĐT" value={view.phone} />
              <Field label="Tổ chức" value={view.organization} />
              <Field label="Khách sạn" value={view.hotel_name} />
              <Field label="Loại phòng" value={view.room_type} />
              <Field label="Số phòng" value={view.rooms?.toString()} />
              <Field label="Số khách" value={view.guests?.toString()} />
              <Field label="Check-in" value={view.check_in} />
              <Field label="Check-out" value={view.check_out} />
              <Field label="Access code" value={view.access_code} />
              <Field label="Ghi chú" value={view.notes} />
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
