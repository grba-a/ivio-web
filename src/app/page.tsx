import { DayBar } from '@/components/DayBar';
import { Hero } from '@/components/Hero';
import { Problem } from '@/components/Problem';
import { Scene } from '@/components/Scene';
import { Ivio } from '@/components/Ivio';
import { Reviews } from '@/components/Reviews';
import { ShapeYourDay } from '@/components/ShapeYourDay';
import { FloatingCta } from '@/components/FloatingCta';
import { Footer } from '@/components/Footer';
import { RevealRoot } from '@/components/RevealRoot';
import { SCENES } from '@/data/day';

export default function Home() {
  return (
    <>
      <DayBar />
      <main>
        <Hero />
        <Problem />
        {SCENES.map((scene, i) => (
          <Scene key={scene.id} scene={scene} index={i} />
        ))}
        <Ivio />
        <Reviews />
        <ShapeYourDay />
      </main>
      <Footer />
      <FloatingCta />
      <RevealRoot />
    </>
  );
}
