import { createFileRoute, redirect } from "@tanstack/react-router";
import { fetchDefaultEventSlug } from "@/lib/event-content";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const slug = await fetchDefaultEventSlug();
    if (slug) {
      throw redirect({ to: "/e/$slug", params: { slug } });
    }
  },
  component: NoEvents,
});

function NoEvents() {
  return (
    <div className="flex min-h-screen items-center justify-center text-white">
      <div className="text-center max-w-md px-4">
        <h1 className="mb-4 text-3xl font-bold">Chưa có sự kiện nào</h1>
        <p className="text-white/70">
          Vui lòng đăng nhập trang <a href="/admin" className="text-gold underline">quản trị</a> để tạo sự kiện đầu tiên.
        </p>
      </div>
    </div>
  );
}
