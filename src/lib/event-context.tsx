import { createContext, useContext, type ReactNode } from "react";
import { useT } from "@/lib/i18n";
import type { EventContent } from "@/lib/event-content";

type EventContextValue = {
  content: EventContent;
  lang: "vi" | "en";
};

const EventContentContext = createContext<EventContextValue | null>(null);

export function EventContentProvider({
  content,
  children,
}: {
  content: EventContent;
  children: ReactNode;
}) {
  const { lang } = useLang();
  return (
    <EventContentContext.Provider value={{ content, lang }}>
      {children}
    </EventContentContext.Provider>
  );
}

/** Returns event content for the current event. Throws if used outside provider. */
export function useEventContent(): EventContextValue {
  const ctx = useContext(EventContentContext);
  if (!ctx) {
    throw new Error("useEventContent must be used inside <EventContentProvider />");
  }
  return ctx;
}

/** Optional variant — returns null outside provider (for components that may render in either context). */
export function useOptionalEventContent(): EventContextValue | null {
  return useContext(EventContentContext);
}
