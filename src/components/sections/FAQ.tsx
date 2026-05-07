import { Section } from "./Overview";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageSquare, Sparkles, Lightbulb } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import faqLottie from "@/assets/faq-chatbot.lottie?url";

const faqs = [
  {
    q: "Who can attend ASF 2026?",
    a: "ASF 2026 is open to institutional members of the securities and bond industry — regulators, dealers, asset managers, exchanges, custodians and accredited investors. Registration is invitation-based; please contact VBMA to request an invitation.",
  },
  {
    q: "How do I register?",
    a: "Click the Register button at the top of this page or contact the ASF 2026 secretariat at asf2026@vbma.org.vn. Early-bird registration closes 15 February 2026.",
  },
  {
    q: "Where will ASF 2026 be held?",
    a: "The forum will take place at the National Convention Center, Hanoi, Vietnam from 14 – 17 April 2026.",
  },
  {
    q: "Do I need a visa to enter Vietnam?",
    a: "Most delegates will need a visa or e-visa to enter Vietnam. Citizens of select countries enjoy visa exemption for short stays. A detailed visa & travel guide is available in the Documents section.",
  },
  {
    q: "What is the dress code?",
    a: "Business attire is required for all conference sessions. Smart casual is acceptable for the city tour and Halong Bay day tour.",
  },
  {
    q: "Is accommodation included?",
    a: "Accommodation is not included in the registration fee. VBMA has secured preferential rates with partner hotels — booking links will be sent upon registration confirmation.",
  },
  {
    q: "What language will sessions be conducted in?",
    a: "All plenary and panel sessions will be conducted in English. Simultaneous interpretation in Vietnamese, Japanese and Korean will be available.",
  },
  {
    q: "Can I sponsor or exhibit at ASF 2026?",
    a: "Yes — please download the Sponsorship Pack from the Documents section or contact sponsorship@vbma.org.vn for tailored packages.",
  },
];

function FloatingIcon({
  Icon,
  className,
  delay = "0s",
}: {
  Icon: typeof HelpCircle;
  className: string;
  delay?: string;
}) {
  return (
    <div
      className={`absolute flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-white/10 text-gold shadow-xl backdrop-blur-md ${className}`}
      style={{
        animation: `faq-float 6s ease-in-out ${delay} infinite`,
      }}
    >
      <Icon size={24} />
    </div>
  );
}

export function FAQ() {
  return (
    <Section id="faq" eyebrow="FAQ" title="Frequently Asked Questions">
      <style>{`
        @keyframes faq-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(4deg); }
        }
        @keyframes faq-pulse-ring {
          0% { transform: scale(0.85); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>

      <div className="grid items-center gap-10 lg:grid-cols-2">
        {/* Left: animation */}
        <div className="relative mx-auto w-full max-w-[600px]">
          <DotLottieReact src={faqLottie} loop autoplay style={{ width: "100%", height: "auto", transform: "scale(1.5)", transformOrigin: "center" }} />
        </div>

        {/* Right: accordion */}
        <div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
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
