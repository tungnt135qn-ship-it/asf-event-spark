import { createFileRoute, redirect } from "@tanstack/react-router";
import { fetchDefaultEventSlug } from "@/lib/event-content";

export const Route = createFileRoute("/library")({
  beforeLoad: async () => {
    const eventSlug = await fetchDefaultEventSlug();
    if (eventSlug) {
      throw redirect({ to: "/e/$slug/library", params: { slug: eventSlug } });
    }
    throw redirect({ to: "/" });
  },
  component: () => null,
});
