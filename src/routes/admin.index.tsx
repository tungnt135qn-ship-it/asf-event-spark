import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/lib/admin-auth";
import { cloneEventFromDefault } from "@/lib/event-clone.functions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Calendar, Globe } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  component: AdminEventsList,
});

type EventRow = {
  id: string;
  slug: string;
  name: { vi: string; en: string };
  status: "draft" | "published" | "archived";
  is_default: boolean;
  start_at: string | null;
  end_at: string | null;
  created_at: string;
};

function AdminEventsList() {
  const { isSuperAdmin } = useAdminAuth();

  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, slug, name, status, is_default, start_at, end_at, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as EventRow[];
    },
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Sự kiện</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Chọn sự kiện để cấu hình hoặc tạo sự kiện mới.
          </p>
        </div>
        {isSuperAdmin && <NewEventDialog onCreated={() => refetch()} />}
      </div>

      {isLoading && <div className="text-muted-foreground">Đang tải…</div>}

      <div className="grid gap-4 md:grid-cols-2">
        {events?.map((ev) => (
          <Card key={ev.id} className="p-5 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-semibold truncate">
                    {ev.name?.vi || ev.name?.en || ev.slug}
                  </h3>
                  {ev.is_default && (
                    <Badge variant="secondary" className="text-[10px]">Mặc định</Badge>
                  )}
                  <Badge
                    variant={ev.status === "published" ? "default" : "outline"}
                    className="text-[10px]"
                  >
                    {ev.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">/{ev.slug}</div>
              </div>
            </div>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              {ev.start_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(ev.start_at).toLocaleDateString("vi-VN")}
                  {ev.end_at && ` → ${new Date(ev.end_at).toLocaleDateString("vi-VN")}`}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5" />
                <a
                  href={`/e/${ev.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Xem trang public
                </a>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="default" disabled>
                Cấu hình (sắp ra mắt)
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {events?.length === 0 && (
        <Card className="p-10 text-center">
          <p className="text-muted-foreground">Chưa có sự kiện nào.</p>
        </Card>
      )}
    </div>
  );
}

function NewEventDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState("");
  const [nameVi, setNameVi] = useState("");
  const [nameEn, setNameEn] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("events").insert({
      slug: slug.trim().toLowerCase(),
      name: { vi: nameVi, en: nameEn },
      status: "draft",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Đã tạo sự kiện");
    setOpen(false);
    setSlug("");
    setNameVi("");
    setNameEn("");
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Tạo sự kiện mới
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Tạo sự kiện mới</DialogTitle>
            <DialogDescription>
              Sau khi tạo, bạn có thể vào cấu hình chi tiết.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                required
                placeholder="vd: asf-2027"
                pattern="[a-z0-9-]+"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name-vi">Tên sự kiện (Tiếng Việt)</Label>
              <Input
                id="name-vi"
                required
                value={nameVi}
                onChange={(e) => setNameVi(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name-en">Event name (English)</Label>
              <Input
                id="name-en"
                required
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Huỷ
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang tạo…" : "Tạo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
