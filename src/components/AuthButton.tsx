import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth, ACCESS_CODES } from "@/lib/auth";
import { LogIn, KeyRound, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { AccountMenu } from "./AccountMenu";

export function AuthButton({ compact: _compact = false }: { compact?: boolean }) {
  const { user, isAuthenticated, loginWithCode } = useAuth();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginWithCode(code);
    if (!res.ok) {
      setErr(res.error);
      return;
    }
    setErr(null);
    setCode("");
    setOpen(false);
    toast.success("Đăng nhập thành công", {
      description: `Chào mừng ${ACCESS_CODES[code.trim().toUpperCase()].name}`,
    });
  };

  if (isAuthenticated && user) {
    return <AccountMenu />;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/10 px-3 py-1.5 text-[12px] font-semibold text-gold hover:bg-gold/20">
          <LogIn size={13} /> Đăng nhập
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound size={18} className="text-gold" /> Đăng nhập bằng mã code
          </DialogTitle>
          <DialogDescription>
            Nhập mã code đại biểu được Ban tổ chức gửi qua email để truy cập đầy đủ thông tin.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="code">Mã code đại biểu</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setErr(null);
              }}
              placeholder="VD: AFF-2026"
              autoComplete="off"
              autoFocus
              className="uppercase tracking-wider"
            />
            {err && <p className="text-xs text-destructive">{err}</p>}
          </div>

          <div className="rounded-xl border border-white/10 bg-muted/30 p-3 text-xs text-muted-foreground">
            <div className="mb-1.5 flex items-center gap-1.5 font-semibold text-foreground">
              <UserIcon size={12} /> Mã code mock để thử
            </div>
            <ul className="space-y-1">
              <li><code className="font-mono text-gold">AFF-2026</code> — AFF member</li>
              <li><code className="font-mono text-gold">SPN-2026</code> — Sponsor</li>
              <li><code className="font-mono text-gold">SPK-2026</code> — Speaker</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Huỷ
            </Button>
            <Button type="submit">Đăng nhập</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
