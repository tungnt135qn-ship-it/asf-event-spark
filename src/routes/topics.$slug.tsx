import { createFileRoute, redirect } from "@tanstack/react-router";
import { fetchDefaultEventSlug } from "@/lib/event-content";

export const Route = createFileRoute("/topics/$slug")({
  beforeLoad: async ({ params }) => {
    const eventSlug = await fetchDefaultEventSlug();
    if (eventSlug) {
      throw redirect({ to: "/e/$slug/topics/$topicSlug", params: { slug: eventSlug, topicSlug: params.slug } });
    }
    throw redirect({ to: "/" });
  },
  component: () => null,
});
