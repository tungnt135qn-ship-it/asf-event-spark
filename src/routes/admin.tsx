import { createFileRoute, Outlet, Link, useRouter } from "@tanstack/react-router";
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, Settings2 } from "lucide-react";
import { AdminLogin } from "@/components/admin/AdminLogin";

export const Route = createFileRoute("/admin")({
  component: AdminRoot,
});

function AdminRoot() {
  return (
    <AdminAuthProvider>
      <AdminGate />
    </AdminAuthProvider>
  );
}

function AdminGate() {
  const { user, loading, rolesLoading, isSuperAdmin, roles } = useAdminAuth();

  if (loading || (user && rolesLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Đang tải…</div>
      </div>
    );
  }

  if (!user) return <AdminLogin />;

  // User logged in but no role assigned
  if (!isSuperAdmin && roles.length === 0) {
    return <NoAccess />;
  }

  return <AdminShell />;
}

function NoAccess() {
  const { user, signOut } = useAdminAuth();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">Tài khoản chưa được cấp quyền</h1>
        <p className="text-sm text-muted-foreground">
          Bạn đã đăng nhập với <strong>{user?.email}</strong> nhưng chưa được cấp quyền truy cập CMS.
          Liên hệ Super Admin để được cấp quyền.
        </p>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
        </Button>
      </div>
    </div>
  );
}

function AdminShell() {
  const { user, signOut } = useAdminAuth();
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden md:flex w-60 flex-col border-r bg-card">
        <div className="px-5 py-4 border-b">
          <div className="text-lg font-bold">CMS</div>
          <div className="text-xs text-muted-foreground">Quản trị sự kiện</div>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-1">
          <Link
            to="/admin"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-accent text-accent-foreground" }}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
          >
            <LayoutDashboard className="h-4 w-4" /> Sự kiện
          </Link>
          <Link
            to="/admin"
            activeProps={{ className: "" }}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
          >
            <Settings2 className="h-4 w-4" /> Cài đặt
          </Link>
        </nav>
        <div className="p-3 border-t space-y-2">
          <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={async () => {
              await signOut();
              router.navigate({ to: "/admin" });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
