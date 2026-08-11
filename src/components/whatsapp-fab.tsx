import { MessageCircle } from "lucide-react";

const PHONE = "917411620595";
const MESSAGE = "Hello! I would like to know more about Lifeline Super Speciality Hospital.";

export function WhatsAppFab() {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 group"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-emerald-500/60 animate-ping"
      />

      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-transform duration-300 group-hover:scale-110">
        <MessageCircle
          className="h-7 w-7"
          fill="currentColor"
          strokeWidth={0}
        />
      </span>

      <span className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-navy px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        Chat on WhatsApp
      </span>
    </a>
  );
}