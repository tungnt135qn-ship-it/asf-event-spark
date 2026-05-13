import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent-foreground))",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#6366f1",
  "#ec4899",
  "#14b8a6",
];

type Row = { submitted_at?: string | null };

function dailySeries<T extends Row>(rows: T[], days = 14) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const buckets: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    buckets[d.toISOString().slice(0, 10)] = 0;
  }
  rows.forEach((r) => {
    const k = (r.submitted_at || "").slice(0, 10);
    if (k in buckets) buckets[k] += 1;
  });
  return Object.entries(buckets).map(([date, count]) => ({
    date: date.slice(5),
    count,
  }));
}

function topCounts<T>(rows: T[], pick: (r: T) => string | null | undefined, n = 8) {
  const m = new Map<string, number>();
  rows.forEach((r) => {
    const k = pick(r) || "—";
    m.set(k, (m.get(k) ?? 0) + 1);
  });
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, value]) => ({ name, value }));
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-4">
      <div className="text-sm font-semibold mb-3">{title}</div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function StatCard({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <Card className="p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </Card>
  );
}

// ============================================================
// Registrations dashboard
// ============================================================
type RegRow = {
  submitted_at?: string | null;
  access_code?: string | null;
  nationality?: string | null;
  country_code?: string | null;
  customer_type?: string | null;
};

export function RegistrationStats({ rows }: { rows: RegRow[] }) {
  const daily = useMemo(() => dailySeries(rows, 14), [rows]);
  const byCode = useMemo(() => topCounts(rows, (r) => r.access_code), [rows]);
  const byNat = useMemo(() => topCounts(rows, (r) => r.nationality), [rows]);
  const byType = useMemo(() => topCounts(rows, (r) => r.customer_type), [rows]);
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = rows.filter((r) => (r.submitted_at || "").slice(0, 10) === today).length;
  const last7 = daily.slice(-7).reduce((s, x) => s + x.count, 0);

  return (
    <div className="space-y-4 mb-6">
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <StatCard label="Tổng đăng ký" value={rows.length} />
        <StatCard label="Hôm nay" value={todayCount} />
        <StatCard label="7 ngày qua" value={last7} />
        <StatCard label="Quốc tịch" value={byNat.length} hint="Số quốc gia" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Đăng ký theo ngày (14 ngày)">
          <BarChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" fontSize={11} />
            <YAxis allowDecimals={false} fontSize={11} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Top quốc tịch">
          <BarChart data={byNat} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" allowDecimals={false} fontSize={11} />
            <YAxis type="category" dataKey="name" width={100} fontSize={11} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
            <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Theo access code">
          <PieChart>
            <Pie data={byCode} dataKey="value" nameKey="name" outerRadius={80} label>
              {byCode.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ChartCard>
        <ChartCard title="Loại khách">
          <PieChart>
            <Pie data={byType} dataKey="value" nameKey="name" outerRadius={80} label>
              {byType.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[(i + 2) % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ChartCard>
      </div>
    </div>
  );
}

// ============================================================
// Bookings dashboard
// ============================================================
type BookRow = {
  submitted_at?: string | null;
  hotel_name?: string | null;
  hotel_id?: string | null;
  status?: string | null;
  rooms?: number | null;
  guests?: number | null;
};

export function BookingStats({ rows }: { rows: BookRow[] }) {
  const daily = useMemo(() => dailySeries(rows, 14), [rows]);
  const byHotel = useMemo(() => topCounts(rows, (r) => r.hotel_name), [rows]);
  const byStatus = useMemo(() => topCounts(rows, (r) => r.status), [rows]);
  const totalRooms = rows.reduce((s, r) => s + (r.rooms ?? 0), 0);
  const totalGuests = rows.reduce((s, r) => s + (r.guests ?? 0), 0);
  const confirmed = rows.filter((r) => r.status === "confirmed").length;

  return (
    <div className="space-y-4 mb-6">
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <StatCard label="Tổng yêu cầu" value={rows.length} />
        <StatCard label="Đã xác nhận" value={confirmed} />
        <StatCard label="Tổng số phòng" value={totalRooms} />
        <StatCard label="Tổng số khách" value={totalGuests} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Đặt phòng theo ngày (14 ngày)">
          <BarChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" fontSize={11} />
            <YAxis allowDecimals={false} fontSize={11} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Theo khách sạn">
          <BarChart data={byHotel} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" allowDecimals={false} fontSize={11} />
            <YAxis type="category" dataKey="name" width={140} fontSize={11} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
            <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Trạng thái">
          <PieChart>
            <Pie data={byStatus} dataKey="value" nameKey="name" outerRadius={80} label>
              {byStatus.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ChartCard>
      </div>
    </div>
  );
}
