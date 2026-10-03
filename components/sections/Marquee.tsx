import { VelocityMarquee } from "@/components/ui/VelocityMarquee";
import { skillRows } from "@/data/skills";

const DOTS = ["bg-coral", "bg-lime", "bg-lilac", "bg-sky", "bg-butter", "bg-mint", "bg-pink"];

function Items({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item, i) => (
        <span key={item} className="font-display mr-10 flex items-center gap-10 whitespace-nowrap text-4xl font-semibold sm:text-6xl">
          {item}
          <span className={`h-3 w-3 rounded-full sm:h-4 sm:w-4 ${DOTS[i % DOTS.length]}`} />
        </span>
      ))}
    </>
  );
}

export function Marquee() {
  return (
    <section aria-label="Skills" className="space-y-4 border-y border-line py-8 sm:space-y-6 sm:py-10">
      <VelocityMarquee speed={3}>
        <Items items={skillRows[0]} />
      </VelocityMarquee>
      <VelocityMarquee speed={-3}>
        <Items items={skillRows[1]} />
      </VelocityMarquee>
    </section>
  );
}
