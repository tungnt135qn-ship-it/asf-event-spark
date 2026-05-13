import { Section } from "./Overview";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import faqLottie from "@/assets/faq-chatbot.lottie?url";
import { useT } from "@/lib/i18n";
import type { Dict } from "@/lib/i18n/dictionaries/en";
import { useFaqs } from "@/lib/event-adapters";

const faqKeys: { q: keyof Dict; a: keyof Dict }[] = [
  { q: "faq.q1", a: "faq.a1" },
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
  { q: "faq.q4", a: "faq.a4" },
  { q: "faq.q5", a: "faq.a5" },
  { q: "faq.q6", a: "faq.a6" },
  { q: "faq.q7", a: "faq.a7" },
  { q: "faq.q8", a: "faq.a8" },
];

export function FAQ() {
  const { t } = useT();
  const dbFaqs = useFaqs();
  const items = dbFaqs ?? faqKeys.map((f) => ({ q: t(f.q), a: t(f.a) }));
  return (
    <Section id="faq" eyebrow={t("faq.eyebrow")} title={t("faq.title")}>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-[600px]">
          <DotLottieReact src={faqLottie} loop autoplay style={{ width: "100%", height: "auto", transform: "scale(1.5)", transformOrigin: "center" }} />
        </div>

        <div>
          <Accordion type="single" collapsible className="space-y-3">
            {items.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/5 px-5 backdrop-blur-md"
              >
                <AccordionTrigger className="text-left text-base font-semibold text-white hover:text-gold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-white/75">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Section>
  );
}
