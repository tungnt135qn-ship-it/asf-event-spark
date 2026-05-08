import { useState } from "react";
import { Section } from "./Overview";
import { hotels, type Hotel } from "@/lib/hotels";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ExternalLink,
  Globe2,
  MapPin,
  Mail,
  Phone,
  BadgePercent,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

function HotelGallery({ images, alt }: { images: string[]; alt: string }) {
  const [idx, setIdx] = useState(0);
  const next = () => setIdx((i) => (i + 1) % images.length);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="relative h-64 overflow-hidden rounded-2xl border border-white/10 sm:h-full sm:min-h-[320px]">
      <img
        src={images[idx]}
        alt={`${alt} ${idx + 1}`}
        loading="lazy"
        className="h-full w-full object-cover transition-all duration-500"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-navy-deep/70 text-white backdrop-blur-md transition hover:bg-navy-deep"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-navy-deep/70 text-white backdrop-blur-md transition hover:bg-navy-deep"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Go to photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-6 bg-gold" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function BookingDialog({ hotel }: { hotel: Hotel }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user, addBooking } = useAuth();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    if (user) {
      addBooking({
        hotelId: hotel.id,
        hotelName: hotel.name,
        name: String(fd.get("passport") || ""),
        email: String(fd.get("email") || ""),
        organisation: String(fd.get("org") || ""),
        phone: String(fd.get("phone") || ""),
        rooms: Number(fd.get("rooms") || 1),
        roomType: String(fd.get("roomType") || ""),
        guests: Number(fd.get("guests") || 1),
        checkin: String(fd.get("checkin") || ""),
        checkout: String(fd.get("checkout") || ""),
        notes: String(fd.get("notes") || "") || undefined,
      });
    }
    setTimeout(() => {
      setSubmitting(false);
      setOpen(false);
      toast.success("Booking request sent", {
        description: `${hotel.name} will contact you shortly.`,
      });
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center justify-center rounded-full bg-destructive px-5 py-2 text-sm font-bold text-destructive-foreground shadow-lg transition hover:opacity-90">
          Book Now
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book a room — {hotel.name}</DialogTitle>
          <DialogDescription>
            Submit your details and the hotel reservation team will contact you to confirm.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-4 pt-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="passport">Full name (as in passport) *</Label>
              <Input id="passport" name="passport" required maxLength={100} defaultValue={user?.name ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org">Organisation *</Label>
              <Input id="org" name="org" required maxLength={120} defaultValue={user?.organisation ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required maxLength={150} defaultValue={user?.email ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" name="phone" type="tel" required maxLength={30} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rooms">Number of rooms *</Label>
              <Input id="rooms" name="rooms" type="number" min={1} max={20} defaultValue={1} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomType">Room type *</Label>
              <Select name="roomType" defaultValue="deluxe">
                <SelectTrigger id="roomType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deluxe">Deluxe Room</SelectItem>
                  <SelectItem value="executive">Executive Room</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="twin">Twin Room</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests">Number of guests *</Label>
              <Input id="guests" name="guests" type="number" min={1} max={20} defaultValue={1} required />
            </div>
            <div />
            <div className="space-y-2">
              <Label htmlFor="checkin">Check-in *</Label>
              <Input id="checkin" name="checkin" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout">Check-out *</Label>
              <Input id="checkout" name="checkout" type="date" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" name="notes" rows={3} maxLength={500} placeholder="Bed preference, dietary needs, late arrival, etc." />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="rounded-full">
              {submitting ? "Sending…" : "Submit booking request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DetailsDialog({ hotel }: { hotel: Hotel }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center justify-center rounded-full border-2 border-gold/60 px-5 py-2 text-sm font-bold text-gold transition hover:bg-gold/10">
          View Details
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{hotel.name}</DialogTitle>
          <DialogDescription>{hotel.tier}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-3">
          {hotel.images.map((src, i) => (
            <img key={i} src={src} alt={`${hotel.name} ${i + 1}`} className="h-32 w-full rounded-lg object-cover" />
          ))}
        </div>
        <p className="text-sm leading-relaxed text-foreground/80">{hotel.description}</p>
        <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold">
            <Sparkles size={14} /> ASF 2026 delegate perks
          </div>
          <ul className="space-y-1 text-sm">
            {hotel.perks.map((p) => (
              <li key={p}>• {p}</li>
            ))}
          </ul>
        </div>
        <div className="grid gap-2 text-sm">
          <a href={hotel.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-foreground hover:text-gold">
            <MapPin size={14} /> {hotel.address}
          </a>
          <a href={hotel.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-foreground hover:text-gold">
            <Globe2 size={14} /> Visit website
          </a>
          <span className="inline-flex items-center gap-2 text-foreground/80">
            <Mail size={14} /> {hotel.contact.email}
          </span>
          <span className="inline-flex items-center gap-2 text-foreground/80">
            <Phone size={14} /> {hotel.contact.phone}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function HotelCard({ h }: { h: Hotel }) {
  return (
    <article
      className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md transition hover:border-gold/30 sm:p-6"
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <HotelGallery images={h.images} alt={h.name} />

        <div className="flex flex-col">
          <div className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold">
            {h.tier}
          </div>
          <h3 className="text-2xl font-bold text-white">{h.name}</h3>

          <div className="mt-3 space-y-2 text-sm text-white/80">
            <a href={h.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-gold">
              <MapPin size={14} className="text-gold" />
              {h.address}
              <ExternalLink size={12} />
            </a>
            <a href={h.website} target="_blank" rel="noreferrer" className="block inline-flex items-center gap-2 hover:text-gold">
              <Globe2 size={14} className="text-gold" />
              {h.website.replace(/^https?:\/\//, "")}
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="mt-4 rounded-xl border border-gold/30 bg-gold/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gold">
              <BadgePercent size={14} /> Delegate offers
            </div>
            <ul className="space-y-1 text-sm text-white/85">
              {h.perks.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 grid gap-1 text-xs text-white/70">
            <div className="font-semibold text-white/85">{h.contact.name}</div>
            <a href={`mailto:${h.contact.email}`} className="inline-flex items-center gap-1.5 hover:text-gold">
              <Mail size={12} /> {h.contact.email}
            </a>
            <a href={`tel:${h.contact.phone}`} className="inline-flex items-center gap-1.5 hover:text-gold">
              <Phone size={12} /> {h.contact.phone}
            </a>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <DetailsDialog hotel={h} />
            <BookingDialog hotel={h} />
          </div>
        </div>
      </div>
    </article>
  );
}

export function Hotels() {
  return (
    <Section id="hotels" eyebrow="Accommodation" title="Official Partner Hotels">
      <p className="mx-auto -mt-6 mb-12 max-w-2xl text-center text-base text-white/70">
        Preferential rates and perks negotiated exclusively for ASF 2026 delegates.
      </p>
      <div className="space-y-10">
        {hotels.map((h) => (
          <HotelCard key={h.id} h={h} />
        ))}
      </div>
    </Section>
  );
}
