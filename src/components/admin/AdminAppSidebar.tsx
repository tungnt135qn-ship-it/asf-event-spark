import { Link, useRouterState, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAdminAuth } from "@/lib/admin-auth";
import { getAdminEvents } from "@/lib/admin-roles.functions";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  CalendarRange,
  Users,
  LogOut,
  Info,
  Sliders,
  Palette,
  FileText,
  Folder,
  UserCheck,
  BedDouble,
  Gauge,
  ChevronDown,
  Newspaper,
  HelpCircle,
  BookOpen,
  CalendarDays,
  Megaphone,
  Image as ImageIcon,
  Hotel,
  KeyRound,
  Mic,
  Award,
  Sparkles,
  Star,
} from "lucide-react";

type EventRow = {
  id: string;
  slug: string;
  name: { vi: string; en: string };
  status: "draft" | "published" | "archived";
  is_default?: boolean;
};

function useCurrentEventId(): string | null {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const m = pathname.match(/^\/admin\/events\/([^/]+)/);
  return m ? m[1] : null;
}

function EventSwitcher({ currentId }: { currentId: string | null }) {
  const { session } = useAdminAuth();
  const router = useRouter();
  const fetchEvents = useServerFn(getAdminEvents);

  const { data } = useQuery({
    queryKey: ["admin-events-switcher"],
    queryFn: async () => {
      const token = session?.access_token;
      if (!token) return [] as EventRow[];
      const rows = await fetchEvents({ headers: { Authorization: `Bearer ${token}` } });
      return rows as unknown as EventRow[];
    },
    enabled: Boolean(session?.access_token),
  });

  const events = data ?? [];

  return (
    <Select
      value={currentId ?? undefined}
      onValueChange={(id) => {
        // Preserve current sub-route (general/settings/content/...)
        const current = router.state.location.pathname;
        const m = current.match(/^\/admin\/events\/[^/]+(\/.*)?$/);
        const sub = m && m[1] ? m[1] : "";
        router.navigate({ to: `/admin/events/${id}${sub}` });
      }}
    >
      <SelectTrigger className="h-9 text-sm">
        <SelectValue placeholder="Chọn sự kiện…" />
      </SelectTrigger>
      <SelectContent>
        {events.map((ev) => (
          <SelectItem key={ev.id} value={ev.id}>
            <span className="truncate">
              {ev.name?.vi || ev.name?.en || ev.slug}
            </span>
          </SelectItem>
        ))}
        {events.length === 0 && (
          <div className="px-2 py-1.5 text-xs text-muted-foreground">Không có sự kiện</div>
        )}
      </SelectContent>
    </Select>
  );
}

export function AdminAppSidebar() {
  const { user, signOut, isSuperAdmin } = useAdminAuth();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const currentEventId = useCurrentEventId();

  const isActive = (path: string, exact = false) =>
    exact ? pathname === path : pathname === path || pathname.startsWith(path + "/") || pathname.startsWith(path + "?");

  const eventBase = currentEventId ? `/admin/events/${currentEventId}` : null;
  const eventTab = (tab: string) =>
    eventBase
      ? pathname === eventBase && (router.state.location.search as Record<string, unknown>)?.tab === tab
      : false;

  const goEventTab = (tab: string) => {
    if (!eventBase) return;
    router.navigate({ to: eventBase, search: { tab } as never });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="px-2 py-2">
          <div className="text-sm font-bold">CMS</div>
          <div className="text-[11px] text-muted-foreground">Quản trị sự kiện</div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* GLOBAL */}
        <SidebarGroup>
          <SidebarGroupLabel>Tổng quan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin", true)}>
                  <Link to="/admin">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Sự kiện</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {isSuperAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/admin/users")}>
                    <Link to="/admin/users">
                      <Users className="h-4 w-4" />
                      <span>Người dùng</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* EVENT-SCOPED */}
        {eventBase && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <CalendarRange className="h-3.5 w-3.5" /> Sự kiện đang chọn
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-2 pb-2">
                <EventSwitcher currentId={currentEventId} />
              </div>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pathname === eventBase && !(router.state.location.search as Record<string, unknown>)?.tab}
                    onClick={() => router.navigate({ to: eventBase })}
                  >
                    <Gauge className="h-4 w-4" />
                    <span>Tổng quan</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={eventTab("general")} onClick={() => goEventTab("general")}>
                    <Info className="h-4 w-4" />
                    <span>Thông tin chung</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={eventTab("settings")} onClick={() => goEventTab("settings")}>
                    <Sliders className="h-4 w-4" />
                    <span>Cấu hình</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={eventTab("theme")} onClick={() => goEventTab("theme")}>
                    <Palette className="h-4 w-4" />
                    <span>Giao diện</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={eventTab("content")} onClick={() => goEventTab("content")}>
                    <FileText className="h-4 w-4" />
                    <span>Nội dung</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={eventTab("modules")} onClick={() => goEventTab("modules")}>
                    <Boxes className="h-4 w-4" />
                    <span>Module</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={eventTab("resources")} onClick={() => goEventTab("resources")}>
                    <Folder className="h-4 w-4" />
                    <span>Tài nguyên</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive(`${eventBase}/registrations`)}>
                    <Link to="/admin/events/$id/registrations" params={{ id: currentEventId! }}>
                      <UserCheck className="h-4 w-4" />
                      <span>Đăng ký</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive(`${eventBase}/bookings`)}>
                    <Link to="/admin/events/$id/bookings" params={{ id: currentEventId! }}>
                      <BedDouble className="h-4 w-4" />
                      <span>Đặt phòng</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="px-2 py-2 space-y-2">
          <div className="text-[11px] text-muted-foreground truncate">{user?.email}</div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={async () => {
              await signOut();
              router.navigate({ to: "/admin" });
            }}
          >
            <LogOut className="mr-2 h-3.5 w-3.5" /> Đăng xuất
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
