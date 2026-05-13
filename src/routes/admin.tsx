import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminAppSidebar } from "@/components/admin/AdminAppSidebar";

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
  if (!isSuperAdmin && roles.length === 0) return <NoAccess />;
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
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <AdminAppSidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <header className="h-12 flex items-center border-b bg-background px-2 md:hidden">
            <SidebarTrigger />
            <span className="ml-2 text-sm font-medium">CMS</span>
          </header>
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
