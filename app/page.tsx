import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Showcase } from "@/components/sections/Showcase";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <AboutTeaser />
      <Showcase />
    </>
  );
}
