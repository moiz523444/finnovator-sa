/*
 * Portfolio content for Alif Landing Solutions.
 *
 * PLACEHOLDER: apart from Finnovator, these projects, clients and numbers are samples.
 * Replace them with your real work. To use a real image instead of the generated cover,
 * put it in /public/portfolio/<slug>/ and set `cover` (and optionally `gallery`) below.
 */

export type ArtVariant = "browser" | "phones" | "laptop" | "poster";

export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  industry: string;
  services: string[];
  summary: string;
  overview: string;
  challenge: string;
  solution: string;
  results: { value: number; suffix: string; label: string; decimals?: number }[];
  /** Colours used for the generated cover art. */
  palette: { from: string; to: string; accent: string; ink: string };
  art: ArtVariant;
  /** Optional real images, e.g. "/portfolio/finnovator/cover.jpg". */
  cover?: string;
  gallery?: string[];
  liveUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "finnovator",
    title: "Finnovator",
    client: "Finnovator",
    year: "2026",
    industry: "Fintech",
    services: ["Landing page", "UI design", "Motion", "Development"],
    summary: "A premium landing page for a payments, lending and open banking platform in Saudi Arabia.",
    overview:
      "Finnovator needed a landing page that felt as engineered as its product: fast, precise and trustworthy, with motion that explains the platform instead of decorating it.",
    challenge:
      "Fintech buyers are cautious. The page had to communicate security and scale in seconds, while still feeling modern enough to stand out from traditional banks.",
    solution:
      "We built an interactive treasury dashboard into the hero, a scroll-driven platform story and a real-time ledger demo, all on a dark, high-contrast system with serif accents.",
    results: [
      { value: 2.1, suffix: "s", label: "Load time on 4G", decimals: 1 },
      { value: 98, suffix: "", label: "Lighthouse performance" },
      { value: 11, suffix: "", label: "Interactive sections" },
    ],
    palette: { from: "#0b1730", to: "#020409", accent: "#2f8cff", ink: "#ffffff" },
    art: "browser",
    liveUrl: "/",
  },
  {
    slug: "noor-dental",
    title: "Noor Dental Clinic",
    client: "Noor Dental (sample)",
    year: "2026",
    industry: "Healthcare",
    services: ["Landing page", "Booking flow", "Copywriting"],
    summary: "A calm, conversion-focused landing page that turns visitors into booked appointments.",
    overview:
      "A modern clinic wanted to replace a slow brochure site with one focused page that answers patient questions and drives online bookings.",
    challenge:
      "Patients arrive anxious and in a hurry. The page needed to build trust quickly and make booking feel effortless on mobile.",
    solution:
      "A soft, reassuring palette, real treatment pricing up front and a three-step booking flow pinned to the bottom of the screen on mobile.",
    results: [
      { value: 64, suffix: "%", label: "More online bookings" },
      { value: 3, suffix: " steps", label: "To book an appointment" },
      { value: 1.4, suffix: "s", label: "Mobile load time", decimals: 1 },
    ],
    palette: { from: "#d9efe9", to: "#8fc9bb", accent: "#0f6b5a", ink: "#0b2e27" },
    art: "phones",
  },
  {
    slug: "saffron-and-co",
    title: "Saffron & Co.",
    client: "Saffron & Co. (sample)",
    year: "2025",
    industry: "Restaurant",
    services: ["Brand refresh", "Landing page", "Menu design"],
    summary: "A warm, editorial landing page for a modern Middle Eastern restaurant.",
    overview:
      "Saffron & Co. wanted their website to feel like their dining room: warm, generous and a little theatrical, with reservations one tap away.",
    challenge:
      "Food photography alone wasn't enough to stand out, and the old site buried the menu and reservations behind multiple pages.",
    solution:
      "Large editorial typography, a scroll-through menu with seasonal dishes and a persistent reservation button connected to their booking system.",
    results: [
      { value: 41, suffix: "%", label: "More reservations" },
      { value: 2.3, suffix: "x", label: "Time on page", decimals: 1 },
      { value: 1, suffix: " tap", label: "To reserve a table" },
    ],
    palette: { from: "#f6b04a", to: "#a3361b", accent: "#2b0d05", ink: "#fff5e6" },
    art: "poster",
  },
  {
    slug: "atlas-realty",
    title: "Atlas Realty",
    client: "Atlas Realty (sample)",
    year: "2025",
    industry: "Real estate",
    services: ["Landing page", "Property search", "Lead capture"],
    summary: "A premium off-plan launch page built to capture qualified buyer leads.",
    overview:
      "Atlas Realty was launching a new residential tower and needed a page that sold the lifestyle before the building existed.",
    challenge:
      "Off-plan buyers need confidence. The page had to show floor plans, payment plans and location clearly without overwhelming people.",
    solution:
      "A cinematic hero, an interactive floor-plan selector and a payment-plan calculator that feeds straight into the sales team's CRM.",
    results: [
      { value: 1200, suffix: "+", label: "Qualified leads" },
      { value: 37, suffix: "%", label: "Lead-to-visit rate" },
      { value: 6, suffix: " wks", label: "Concept to launch" },
    ],
    palette: { from: "#2a2f3a", to: "#0c0e12", accent: "#d8b26e", ink: "#f5efe3" },
    art: "laptop",
  },
  {
    slug: "pulse-fitness",
    title: "Pulse Fitness",
    client: "Pulse Fitness (sample)",
    year: "2025",
    industry: "Fitness app",
    services: ["App landing page", "Motion", "App store assets"],
    summary: "A high-energy launch page for a training app, built to drive downloads.",
    overview:
      "Pulse needed a launch page that matched the intensity of its workouts and pushed visitors straight to the app stores.",
    challenge:
      "Fitness apps all look alike. The page had to feel energetic and specific without slowing down on mobile data.",
    solution:
      "Bold kinetic type, looping product motion and social proof from real members, with store buttons always within thumb reach.",
    results: [
      { value: 52, suffix: "%", label: "Higher install rate" },
      { value: 4.8, suffix: "★", label: "Average store rating", decimals: 1 },
      { value: 30, suffix: "k", label: "Launch-week visitors" },
    ],
    palette: { from: "#d7ff3f", to: "#5ec400", accent: "#0b0b0b", ink: "#0b0b0b" },
    art: "phones",
  },
  {
    slug: "lumen-saas",
    title: "Lumen Analytics",
    client: "Lumen (sample)",
    year: "2024",
    industry: "SaaS",
    services: ["Landing page", "Product UI", "Development"],
    summary: "A crisp product landing page for a B2B analytics platform.",
    overview:
      "Lumen's product was powerful but hard to explain. They needed a page that showed the product working within the first scroll.",
    challenge:
      "Long feature lists were losing visitors. The team needed a clear story from problem to proof to pricing.",
    solution:
      "An animated product walkthrough in the hero, outcome-led sections and transparent pricing with a free-trial call to action.",
    results: [
      { value: 2.6, suffix: "x", label: "More trial sign-ups", decimals: 1 },
      { value: 48, suffix: "%", label: "Lower bounce rate" },
      { value: 99, suffix: "", label: "Lighthouse SEO" },
    ],
    palette: { from: "#e9e6ff", to: "#9b8cff", accent: "#2a1d8f", ink: "#140d4d" },
    art: "browser",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
