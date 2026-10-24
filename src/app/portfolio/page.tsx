import type { Metadata } from "next";
import PortfolioView from "@/components/portfolio/PortfolioView";

export const metadata: Metadata = {
  title: "Alif Landing Solutions | Selected Work",
  description: "Landing pages designed and built by Alif Landing Solutions. Browse selected projects and case studies.",
};

export default function PortfolioPage() {
  return <PortfolioView />;
}
