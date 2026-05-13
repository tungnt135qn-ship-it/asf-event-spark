import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin-auth";
import { getEventResourcesAdmin } from "@/lib/event-resources-admin.functions";
import { getEventModulesAdmin } from "@/lib/event-modules-admin.functions";
import { getEventContentAdmin } from "@/lib/event-content-admin.functions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Newspaper,
  HelpCircle,
  BookOpen,
  Image as ImageIcon,
  FileText,
  Megaphone,
  CalendarDays,
  Users,
  Hotel,
  ExternalLink,
} from "lucide-react";

export function OverviewDashboard({ eventId }: { eventId: string }) {
  const { session } = useAdminAuth();
  const fetchRes = useServerFn(getEventResourcesAdmin);
  const fetchMod = useServerFn(getEventModulesAdmin);
  const fetchContent = useServerFn(getEventContentAdmin);

  const auth = () => ({ Authorization: `Bearer ${session?.access_token}` });
  const enabled = Boolean(session?.access_token);

  const res = useQuery({
    queryKey: ["overview-resources", eventId],
    queryFn: () => fetchRes({ data: { event_id: eventId }, headers: auth() }),
    enabled,
  });
  const mod = useQuery({
    queryKey: ["overview-modules", eventId],
    queryFn: () => fetchMod({ data: { event_id: eventId }, headers: auth() }),
    enabled,
  });
  const con = useQuery({
    queryKey: ["overview-content", eventId],
    queryFn: () => fetchContent({ data: { event_id: eventId }, headers: auth() }),
    enabled,
  });

  const stats = [
    { label: "Tin tức", icon: Newspaper, count: res.data?.news?.length ?? 0, sub: "news" },
    { label: "FAQ", icon: HelpCircle, count: mod.data?.faqs?.length ?? 0, sub: "faqs" },
    { label: "Chủ đề", icon: BookOpen, count: mod.data?.topics?.length ?? 0, sub: "topics" },
    { label: "Lịch trình (ngày)", icon: CalendarDays, count: mod.data?.agenda_days?.length ?? 0, sub: "agenda" },
    { label: "Diễn giả", icon: Users, count: mod.data?.speakers?.length ?? 0, sub: "speakers" },
    { label: "Khách sạn", icon: Hotel, count: res.data?.hotels?.length ?? 0, sub: "hotels" },
    { label: "Tài liệu", icon: FileText, count: res.data?.documents?.length ?? 0, sub: "documents" },
    { label: "Thư viện", icon: ImageIcon, count: res.data?.library_items?.length ?? 0, sub: "library" },
    { label: "Thông cáo", icon: Megaphone, count: res.data?.press_releases?.length ?? 0, sub: "press" },
  ];

  const heroOk = Boolean((con.data?.hero as Record<string, unknown> | null)?.tagline);
  const overviewOk = Boolean((con.data?.overview as Record<string, unknown> | null)?.title);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="text-2xl font-bold mt-1">{s.count}</div>
              </div>
              <s.icon className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-3">Trạng thái nội dung</h3>
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant={heroOk ? "default" : "outline"}>Hero {heroOk ? "✓" : "thiếu"}</Badge>
          <Badge variant={overviewOk ? "default" : "outline"}>Overview {overviewOk ? "✓" : "thiếu"}</Badge>
          <Badge variant={(con.data?.why_attend_items?.length ?? 0) > 0 ? "default" : "outline"}>
            Why Attend ({con.data?.why_attend_items?.length ?? 0})
          </Badge>
          <Badge variant={(con.data?.key_contents?.length ?? 0) > 0 ? "default" : "outline"}>
            Key Content ({con.data?.key_contents?.length ?? 0})
          </Badge>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-3">Truy cập nhanh</h3>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to="/admin/events/$id/registrations" params={{ id: eventId }}>
              <Users className="mr-1 h-4 w-4" /> Đăng ký
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/admin/events/$id/bookings" params={{ id: eventId }}>
              <Hotel className="mr-1 h-4 w-4" /> Đặt phòng
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
