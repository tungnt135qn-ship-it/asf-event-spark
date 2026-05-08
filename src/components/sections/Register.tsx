import { useEffect, useRef, useState } from "react";
import { Section } from "./Overview";
import { ArrowRight, Calendar, MapPin, Users, Mail, CheckCircle2, ExternalLink, Paperclip } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { hotels } from "@/lib/hotels";
import { countries, customerTypes } from "@/lib/countries";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import signupLottie from "@/assets/signup.lottie?url";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  nationality: z.string().trim().min(1, "Please enter your nationality").max(80),
  phoneCountry: z.string().trim().min(1, "Select country code"),
  phone: z.string().trim().min(4, "Invalid phone number").max(30),
  organisation: z.string().trim().min(2, "Please enter your organisation").max(150),
  title: z.string().trim().max(150).optional(),
  customerType: z.string().trim().min(1, "Please select customer type"),
});

type FormState = z.infer<typeof schema>;

const empty: FormState = {
  name: "",
  email: "",
  nationality: "",
  phoneCountry: "VN",
  phone: "",
  organisation: "",
  title: "",
  customerType: "",
};

export function Register() {
  const { user, addRegistration } = useAuth();
  const { t } = useT();
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [open, setOpen] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [passport, setPassport] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const passportRef = useRef<HTMLInputElement>(null);

  // Auto-fill from logged-in user (code + customer type + name/email/org)
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      name: f.name || user.name,
      email: f.email || user.email,
      organisation: f.organisation || user.organisation,
      customerType: user.role,
    }));
  }, [user]);

  useEffect(() => {
    const scrollToCenter = (behavior: ScrollBehavior = "auto") => {
      const el = formRef.current;
      if (!el) return;
      const headerH = document.querySelector("header")?.getBoundingClientRect().height ?? 80;
      const rect = el.getBoundingClientRect();
      const available = window.innerHeight - headerH;
      const centeredOffset = Math.max(16, (available - rect.height) / 2);
      const targetY = window.scrollY + rect.top - headerH - centeredOffset;
      window.scrollTo({ top: Math.max(0, targetY), behavior });
    };
    const scheduleScrollToCenter = (behavior: ScrollBehavior = "auto") => {
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToCenter(behavior)));
    };
    const onHash = () => {
      if (window.location.hash === "#register") {
        scheduleScrollToCenter();
      }
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest('a[href="#register"]') as HTMLAnchorElement | null;
      if (!a) return;
      e.preventDefault();
      if (window.location.hash !== "#register") {
        history.replaceState(null, "", "#register");
      }
      scheduleScrollToCenter("smooth");
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onClick);
    };
  }, []);

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
    if (user) {
      addRegistration({
        name: r.data.name,
        email: r.data.email,
        nationality: r.data.nationality,
        phone: `${r.data.phoneCountry} ${r.data.phone}`,
        organisation: r.data.organisation,
        title: r.data.title,
        customerType: r.data.customerType,
      });
    }
    setOpen(true);
    setForm(empty);
    setPassport(null);
    if (passportRef.current) passportRef.current.value = "";
    toast.success("Registration submitted successfully");
  };

  return (
    <Section id="registration" eyebrow="Registration" title="Reserve Your Seat at ASF 2026">
      <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-navy via-secondary to-navy-deep p-8 sm:p-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-destructive/20 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left info */}
          <div>
            <h3 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Cùng 100–150 đại biểu định hình{" "}
              <span className="text-gradient-gold">thị trường vốn Châu Á</span>
            </h3>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              Early-bird registration is open until 15 August 2026. Secure your delegate pass,
              welcome dinner and Halong Bay day tour today.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { Icon: Calendar, text: "1 – 4 October 2026" },
                { Icon: MapPin, text: "Meliá Hanoi Hotel, Hà Nội" },
                { Icon: Users, text: "30+ hiệp hội · 100–150 đại biểu" },
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

            <div className="mt-6 flex justify-center lg:justify-start">
              <DotLottieReact
                src={signupLottie}
                loop
                autoplay
                className="w-full max-w-md"
              />
            </div>
          </div>

          {/* Right form */}
          <form
            ref={formRef}
            aria-label="Delegate Registration"
            onSubmit={onSubmit}
            className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md sm:p-8"
          >
            <h4 className="text-xl font-bold text-white">Delegate Registration</h4>
            <p className="mt-1 text-sm text-white/60">Fill in your details — we'll confirm by email.</p>

            <div className="mt-5 grid gap-3">
              <Field label="Full name *" error={errors.name}>
                <Input value={form.name} onChange={update("name")} placeholder="As in your passport" className="bg-white/5 text-white placeholder:text-white/40 border-white/15" />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Email *" error={errors.email}>
                  <Input type="email" value={form.email} onChange={update("email")} placeholder="you@company.com" className="bg-white/5 text-white placeholder:text-white/40 border-white/15" />
                </Field>
                <Field label="Nationality *" error={errors.nationality}>
                  <Input value={form.nationality} onChange={update("nationality")} placeholder="e.g. Vietnamese" className="bg-white/5 text-white placeholder:text-white/40 border-white/15" />
                </Field>
              </div>
              <Field label="Phone *" error={errors.phoneCountry || errors.phone}>
                <div className="flex gap-2">
                  <Select value={form.phoneCountry} onValueChange={(v) => setForm((f) => ({ ...f, phoneCountry: v }))}>
                    <SelectTrigger className="w-[140px] bg-white/5 text-white border-white/15">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.code}>{c.flag} {c.dial}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input value={form.phone} onChange={update("phone")} placeholder="Phone number" className="flex-1 bg-white/5 text-white placeholder:text-white/40 border-white/15" />
                </div>
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Organisation *" error={errors.organisation}>
                  <Input value={form.organisation} onChange={update("organisation")} placeholder="Company / Institution" className="bg-white/5 text-white placeholder:text-white/40 border-white/15" />
                </Field>
                <Field label="Job title" error={errors.title}>
                  <Input value={form.title} onChange={update("title")} placeholder="e.g. Head of Fixed Income" className="bg-white/5 text-white placeholder:text-white/40 border-white/15" />
                </Field>
              </div>
              <Field label="Customer type *" error={errors.customerType}>
                <Select value={form.customerType} onValueChange={(v) => setForm((f) => ({ ...f, customerType: v }))}>
                  <SelectTrigger className="bg-white/5 text-white border-white/15">
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {customerTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Passport photo (optional)">
                <div className="flex items-center gap-2">
                  <input
                    ref={passportRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPassport(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => passportRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/85 hover:bg-white/10"
                  >
                    <Paperclip size={14} /> Attach passport image
                  </button>
                  {passport && (
                    <span className="truncate text-xs text-white/70">{passport.name}</span>
                  )}
                </div>
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
