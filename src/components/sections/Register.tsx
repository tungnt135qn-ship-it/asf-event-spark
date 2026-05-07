import { useState } from "react";
import { Section } from "./Overview";
import { ArrowRight, Calendar, MapPin, Users, Mail, CheckCircle2, ExternalLink } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { hotels } from "@/lib/hotels";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(6, "Invalid phone number").max(30),
  organisation: z.string().trim().min(2, "Please enter your organisation").max(150),
  title: z.string().trim().max(150).optional(),
  notes: z.string().trim().max(500).optional(),
});

type FormState = z.infer<typeof schema>;

const empty: FormState = {
  name: "",
  email: "",
  phone: "",
  organisation: "",
  title: "",
  notes: "",
};

export function Register() {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [open, setOpen] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const fe: Partial<Record<keyof FormState, string>> = {};
      for (const i of r.error.issues) fe[i.path[0] as keyof FormState] = i.message;
      setErrors(fe);
      return;
    }
    setErrors({});
    setSubmittedName(r.data.name);
    setOpen(true);
    setForm(empty);
    toast.success("Registration submitted successfully");
  };

  return (
    <Section id="registration" eyebrow="Registration" title="Reserve Your Seat at ASF 2026">
      <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-navy via-secondary to-navy-deep p-8 sm:p-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-destructive/20 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* Left info */}
          <div>
            <h3 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Join 1,000+ delegates shaping{" "}
              <span className="text-gradient-gold">Asia's capital markets</span>
            </h3>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              Early-bird registration is open until 15 February 2026. Secure your delegate pass,
              optional gala dinner and Halong Bay day tour today.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { Icon: Calendar, text: "14 – 17 April 2026" },
                { Icon: MapPin, text: "National Convention Center, Hanoi" },
                { Icon: Users, text: "20+ markets · 60+ speakers" },
                { Icon: Mail, text: "asf2026@vbma.org.vn" },
              ].map(({ Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85"
                >
                  <Icon size={16} className="text-gold" />
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { tier: "Early Bird", price: "USD 690", until: "Until 15 Feb 2026", highlight: true },
                { tier: "Standard", price: "USD 890", until: "Until 31 Mar 2026", highlight: false },
                { tier: "On-site", price: "USD 1,090", until: "From 1 Apr 2026", highlight: false },
              ].map((p) => (
                <div
                  key={p.tier}
                  className={`rounded-2xl border p-4 backdrop-blur-md ${
                    p.highlight
                      ? "border-gold bg-gold/10 shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className={`text-[10px] font-bold uppercase tracking-[0.18em] ${p.highlight ? "text-gold" : "text-white/60"}`}>
                    {p.tier}
                  </div>
                  <div className="mt-2 text-xl font-extrabold text-white">{p.price}</div>
                  <div className="mt-1 text-[11px] text-white/60">{p.until}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <form
            id="register"
            onSubmit={onSubmit}
            className="scroll-mt-[calc(30vh+25px)] rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md sm:p-8"
          >
            <h4 className="text-xl font-bold text-white">Delegate Registration</h4>
            <p className="mt-1 text-sm text-white/60">Fill in your details — we'll confirm by email.</p>

            <div className="mt-5 grid gap-4">
              <Field label="Full name *" error={errors.name}>
                <Input value={form.name} onChange={update("name")} placeholder="As in your passport" className="bg-white/5 text-white placeholder:text-white/40 border-white/15" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email *" error={errors.email}>
                  <Input type="email" value={form.email} onChange={update("email")} placeholder="you@company.com" className="bg-white/5 text-white placeholder:text-white/40 border-white/15" />
                </Field>
                <Field label="Phone *" error={errors.phone}>
                  <Input value={form.phone} onChange={update("phone")} placeholder="+84 ..." className="bg-white/5 text-white placeholder:text-white/40 border-white/15" />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Organisation *" error={errors.organisation}>
                  <Input value={form.organisation} onChange={update("organisation")} placeholder="Company / Institution" className="bg-white/5 text-white placeholder:text-white/40 border-white/15" />
                </Field>
                <Field label="Job title" error={errors.title}>
                  <Input value={form.title} onChange={update("title")} placeholder="e.g. Head of Fixed Income" className="bg-white/5 text-white placeholder:text-white/40 border-white/15" />
                </Field>
              </div>
              <Field label="Notes" error={errors.notes}>
                <Textarea value={form.notes} onChange={update("notes")} placeholder="Dietary needs, accessibility, sessions of interest..." rows={3} className="bg-white/5 text-white placeholder:text-white/40 border-white/15" />
              </Field>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-destructive px-7 py-3 text-sm font-bold text-destructive-foreground shadow-lg transition hover:opacity-90"
            >
              Complete Registration <ArrowRight size={16} className="ml-2" />
            </button>
          </form>
        </div>
      </div>

      {/* Success dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-navy-deep via-secondary to-navy text-white border-gold/30">
          <DialogHeader>
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
              <CheckCircle2 size={32} />
            </div>
            <DialogTitle className="text-center text-2xl text-white">
              Congratulations{submittedName ? `, ${submittedName.split(" ")[0]}` : ""}!
            </DialogTitle>
            <DialogDescription className="text-center text-white/75">
              Your ASF 2026 registration has been received. A confirmation email is on the way.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 rounded-2xl border border-gold/30 bg-gold/5 p-5">
            <div className="text-sm font-bold text-gold">Need a place to stay?</div>
            <p className="mt-1 text-sm text-white/80">
              Enjoy exclusive ASF 2026 rates at our partner hotels in Hanoi. Reserve early — rooms
              are limited.
            </p>

            <div className="mt-4 grid gap-3">
              {hotels.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <img src={h.images[0]} alt={h.name} className="h-14 w-20 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-white">{h.name}</div>
                    <div className="truncate text-xs text-white/60">{h.tier} · {h.perks[0]}</div>
                  </div>
                  <a
                    href="#hotels"
                    onClick={() => setOpen(false)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-gold/50 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/10"
                  >
                    Book <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-3">
              <a
                href="#hotels"
                onClick={() => setOpen(false)}
                className="flex-1 inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-navy-deep hover:opacity-90"
              >
                View All Partner Hotels
              </a>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/5"
              >
                Maybe later
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wider text-white/70">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
