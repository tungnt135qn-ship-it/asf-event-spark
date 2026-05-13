import { createFileRoute, redirect } from "@tanstack/react-router";
import { fetchDefaultEventSlug } from "@/lib/event-content";

export const Route = createFileRoute("/news/$slug")({
  beforeLoad: async ({ params }) => {
    const eventSlug = await fetchDefaultEventSlug();
    if (eventSlug) {
      throw redirect({ to: "/e/$slug/news/$newsSlug", params: { slug: eventSlug, newsSlug: params.slug } });
    }
    throw redirect({ to: "/" });
  },
  component: () => null,
});
