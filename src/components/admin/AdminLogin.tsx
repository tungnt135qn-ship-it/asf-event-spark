import { useState } from "react";
import { useAdminAuth } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function AdminLogin() {
  const { signIn, signUp } = useAdminAuth();
  const [tab, setTab] = useState("signin");
  const [loading, setLoading] = useState(false);

  // sign in
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // sign up
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suName, setSuName] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) toast.error(error);
    else toast.success("Đăng nhập thành công");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(suEmail, suPassword, suName);
    setLoading(false);
    if (error) toast.error(error);
    else
      toast.success(
        "Đăng ký thành công. Kiểm tra email để xác nhận, sau đó đăng nhập.",
      );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">CMS Quản trị</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Đăng nhập để cấu hình sự kiện
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Đăng nhập</TabsTrigger>
            <TabsTrigger value="signup">Đăng ký</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang xử lý…" : "Đăng nhập"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="su-name">Họ tên</Label>
                <Input
                  id="su-name"
                  required
                  value={suName}
                  onChange={(e) => setSuName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="su-email">Email</Label>
                <Input
                  id="su-email"
                  type="email"
                  required
                  value={suEmail}
                  onChange={(e) => setSuEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="su-password">Mật khẩu (tối thiểu 6 ký tự)</Label>
                <Input
                  id="su-password"
                  type="password"
                  required
                  minLength={6}
                  value={suPassword}
                  onChange={(e) => setSuPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang xử lý…" : "Tạo tài khoản"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Tài khoản mới chưa có quyền — cần Super Admin cấp quyền sau khi
                đăng ký.
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
