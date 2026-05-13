// Admin server functions for registrations & bookings management.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const eventIdInput = z.object({ event_id: z.string().uuid() });

export const listRegistrations = createServerFn({ method: "GET" })
  .inputValidator((d) => eventIdInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: rows, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("event_id", data.event_id)
      .order("submitted_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

export const listBookings = createServerFn({ method: "GET" })
  .inputValidator((d) => eventIdInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const [{ data: rows, error }, { data: hotels }] = await Promise.all([
      supabase
        .from("bookings")
        .select("*")
        .eq("event_id", data.event_id)
        .order("submitted_at", { ascending: false })
        .limit(1000),
      supabase.from("hotels").select("id,name").eq("event_id", data.event_id),
    ]);
    if (error) throw new Error(error.message);
    return { rows: rows ?? [], hotels: hotels ?? [] };
  });

const updateBookingInput = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "confirmed", "cancelled"]),
});

export const updateBookingStatus = createServerFn({ method: "POST" })
  .inputValidator((d) => updateBookingInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase
      .from("bookings")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const deleteInput = z.object({ id: z.string().uuid() });

export const deleteRegistration = createServerFn({ method: "POST" })
  .inputValidator((d) => deleteInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("registrations").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteBooking = createServerFn({ method: "POST" })
  .inputValidator((d) => deleteInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("bookings").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
