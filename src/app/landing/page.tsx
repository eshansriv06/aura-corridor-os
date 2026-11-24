import { Metadata } from "next";
import { AuraLandingPage } from "@/components/landing/AuraLandingPage";

export const metadata: Metadata = {
  title: "Aura // Corridor OS : Automated Emergency Green Corridor Platform",
  description:
    "Mission-critical automated emergency green corridor and triage platform synchronizing municipal SCATS traffic controllers, AWS IoT Core, and KGMU Trauma Centre.",
};

export default function LandingPage() {
  return <AuraLandingPage />;
}
