import { Section } from "./Overview";

const speakers = [
  { name: "Dr. Nguyen Hoang Duong", role: "Chairman", org: "VBMA" },
  { name: "Le Thi Minh Anh", role: "Deputy Director", org: "State Securities Commission" },
  { name: "Hiroshi Tanaka", role: "Managing Director", org: "Japan Securities Dealers Assoc." },
  { name: "Sarah Chen", role: "Head of Asia Fixed Income", org: "Global Asset Management" },
  { name: "Raj Mehta", role: "CEO", org: "Asia Capital Markets" },
  { name: "Kim Soo-jin", role: "Chief Economist", org: "Korea Financial Investment" },
  { name: "Andrew Lim", role: "Partner", org: "Singapore Exchange" },
  { name: "Maria Santos", role: "Head of ESG", org: "ASEAN Capital Markets Forum" },
];

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold via-gold-soft to-white text-navy-deep text-2xl font-black shadow-[var(--shadow-glow)]">
      {initials}
    </div>
  );
}

export function Speakers() {
  return (
    <Section id="speakers" eyebrow="Speakers" title="Voices Shaping the Future">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {speakers.map((s) => (
          <div
            key={s.name}
            className="group flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md transition hover:-translate-y-1 hover:border-gold/40"
          >
            <Avatar name={s.name} />
            <h3 className="mt-4 text-base font-bold text-white">{s.name}</h3>
            <div className="mt-1 text-xs text-gold">{s.role}</div>
            <div className="mt-1 text-xs text-white/60">{s.org}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center text-sm text-white/60">More speakers to be announced</div>
    </Section>
  );
}
