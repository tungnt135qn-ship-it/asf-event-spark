import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  listAdminUsers,
  grantRole,
  revokeRole,
  inviteAdminUser,
} from "@/lib/admin-users.functions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Trash2, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

type AppRole = "super_admin" | "event_admin" | "editor";

type EventLite = { id: string; slug: string; name: { vi?: string; en?: string } };
type RoleRow = { id: string; role: AppRole; event_id: string | null };
type UserRow = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  roles: RoleRow[];
};

function UsersPage() {
  const { isSuperAdmin, session, rolesLoading } = useAdminAuth();
  const fetchList = useServerFn(listAdminUsers);
  const grantFn = useServerFn(grantRole);
  const revokeFn = useServerFn(revokeRole);

  const auth = () => {
    const t = session?.access_token;
    if (!t) throw new Error("Phiên đăng nhập không hợp lệ");
    return { Authorization: `Bearer ${t}` };
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => fetchList({ headers: auth() }),
    enabled: Boolean(session?.access_token) && isSuperAdmin,
  });

  const [q, setQ] = useState("");

  if (rolesLoading) {
    return <div className="p-10 text-sm text-muted-foreground">Đang tải…</div>;
  }
  if (!isSuperAdmin) {
    return (
      <div className="p-10">
        <Card className="p-5 text-sm">
          Chỉ Super Admin mới truy cập được trang này.
        </Card>
      </div>
    );
  }

  const users = (data?.users ?? []) as UserRow[];
  const events = (data?.events ?? []) as EventLite[];

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return users;
    return users.filter((u) =>
      [u.email, u.full_name].filter(Boolean).some((v) =>
        String(v).toLowerCase().includes(qq),
      ),
    );
  }, [users, q]);

  const onRevoke = async (id: string) => {
    if (!confirm("Thu hồi vai trò này?")) return;
    try {
      await revokeFn({ data: { id }, headers: auth() });
      toast.success("Đã thu hồi");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Có lỗi");
    }
  };

  const onGrant = async (
    user_id: string,
    role: AppRole,
    event_id: string | null,
  ) => {
    try {
      await grantFn({ data: { user_id, role, event_id }, headers: auth() });
      toast.success("Đã cấp quyền");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Có lỗi");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin">
            <ArrowLeft className="mr-1 h-4 w-4" /> Sự kiện
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Người dùng CMS</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tổng {users.length} tài khoản
          </p>
        </div>
        <InviteDialog events={events} onDone={() => refetch()} />
      </div>

      <Card className="p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo email hoặc tên…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-sm text-muted-foreground">Đang tải…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-sm text-muted-foreground">Không có dữ liệu.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3 font-medium">Người dùng</th>
                  <th className="p-3 font-medium">Vai trò hiện có</th>
                  <th className="p-3 font-medium">Đăng nhập gần nhất</th>
                  <th className="p-3 font-medium">Cấp quyền</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-t align-top">
                    <td className="p-3">
                      <div className="font-medium">{u.full_name || "(chưa đặt tên)"}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </td>
                    <td className="p-3">
                      {u.roles.length === 0 ? (
                        <span className="text-muted-foreground text-xs">—</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {u.roles.map((r) => (
                            <Badge
                              key={r.id}
                              variant={r.role === "super_admin" ? "default" : "secondary"}
                              className="gap-1"
                            >
                              {r.role}
                              {r.event_id && (
                                <span className="opacity-70">
                                  · {events.find((e) => e.id === r.event_id)?.slug ?? r.event_id.slice(0, 6)}
                                </span>
                              )}
                              <button
                                onClick={() => onRevoke(r.id)}
                                className="ml-1 hover:text-destructive"
                                title="Thu hồi"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-muted-foreground text-xs whitespace-nowrap">
                      {u.last_sign_in_at
                        ? new Date(u.last_sign_in_at).toLocaleString("vi-VN")
                        : "Chưa đăng nhập"}
                    </td>
                    <td className="p-3">
                      <GrantInline
                        events={events}
                        onGrant={(role, eventId) => onGrant(u.id, role, eventId)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function GrantInline({
  events,
  onGrant,
}: {
  events: EventLite[];
  onGrant: (role: AppRole, eventId: string | null) => void;
}) {
  const [role, setRole] = useState<AppRole>("editor");
  const [eventId, setEventId] = useState<string>("");

  const needsEvent = role !== "super_admin";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
        <SelectTrigger className="h-8 w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="editor">editor</SelectItem>
          <SelectItem value="event_admin">event_admin</SelectItem>
          <SelectItem value="super_admin">super_admin</SelectItem>
        </SelectContent>
      </Select>
      {needsEvent && (
        <Select value={eventId} onValueChange={setEventId}>
          <SelectTrigger className="h-8 w-[180px]">
            <SelectValue placeholder="Chọn sự kiện" />
          </SelectTrigger>
          <SelectContent>
            {events.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name?.vi || e.name?.en || e.slug}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Button
        size="sm"
        variant="outline"
        disabled={needsEvent && !eventId}
        onClick={() => onGrant(role, needsEvent ? eventId : null)}
      >
        <Plus className="mr-1 h-4 w-4" /> Cấp
      </Button>
    </div>
  );
}

function InviteDialog({
  events,
  onDone,
}: {
  events: EventLite[];
  onDone: () => void;
}) {
  const { session } = useAdminAuth();
  const inviteFn = useServerFn(inviteAdminUser);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<AppRole>("editor");
  const [eventId, setEventId] = useState("");
  const [busy, setBusy] = useState(false);

  const needsEvent = role !== "super_admin";

  const submit = async () => {
    const t = session?.access_token;
    if (!t) return;
    setBusy(true);
    try {
      const res = await inviteFn({
        data: {
          email,
          full_name: fullName || undefined,
          role,
          event_id: needsEvent ? eventId : null,
          redirect_to: `${window.location.origin}/admin`,
        },
        headers: { Authorization: `Bearer ${t}` },
      });
      toast.success(
        res.invited ? "Đã gửi lời mời qua email" : "Đã cấp quyền cho user hiện có",
      );
      setOpen(false);
      setEmail("");
      setFullName("");
      setEventId("");
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Có lỗi");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Mời người dùng
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mời thành viên CMS</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          <div>
            <Label className="text-xs">Họ tên (tuỳ chọn)</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Vai trò</Label>
            <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="editor">editor</SelectItem>
                <SelectItem value="event_admin">event_admin</SelectItem>
                <SelectItem value="super_admin">super_admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {needsEvent && (
            <div>
              <Label className="text-xs">Sự kiện</Label>
              <Select value={eventId} onValueChange={setEventId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn sự kiện" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name?.vi || e.name?.en || e.slug}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={submit}
            disabled={busy || !email || (needsEvent && !eventId)}
          >
            {busy ? "Đang gửi…" : "Gửi lời mời"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
