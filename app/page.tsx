import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { Hero } from "@/components/sections/Hero";
import { Showcase } from "@/components/sections/Showcase";
import { Toolbox } from "@/components/sections/Toolbox";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Toolbox />
      <AboutTeaser />
      <Showcase />
    </>
  );
}
