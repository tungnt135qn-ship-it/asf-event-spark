import { Link } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { LogOut, ClipboardList, Hotel as HotelIcon, BadgeCheck } from "lucide-react";
import { toast } from "sonner";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function AccountMenu() {
  const { user, logout } = useAuth();
  const { t } = useT();
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Account menu"
          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold to-amber-600 text-[12px] font-bold text-navy-deep ring-2 ring-gold/40 transition hover:ring-gold/80"
        >
          {initials(user.name)}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 border-white/10 bg-navy-deep/95 text-white backdrop-blur">
        <DropdownMenuLabel className="flex items-start gap-3 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-amber-600 text-sm font-bold text-navy-deep">
            {initials(user.name)}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-sm font-semibold">{user.name}</div>
            <div className="truncate text-[11px] text-white/60">{user.email}</div>
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
              <BadgeCheck size={10} /> {user.role}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem asChild className="focus:bg-gold/10 focus:text-gold">
          <Link to="/account/registrations" className="cursor-pointer">
            <ClipboardList size={14} /> Lịch sử đăng ký
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="focus:bg-gold/10 focus:text-gold">
          <Link to="/account/bookings" className="cursor-pointer">
            <HotelIcon size={14} /> Khách sạn đã booking
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          onClick={() => {
            logout();
            toast("Đã đăng xuất");
          }}
          className="cursor-pointer focus:bg-destructive/20 focus:text-destructive"
        >
          <LogOut size={14} /> Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
