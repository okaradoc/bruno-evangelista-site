import { Hero } from '../components/Hero';
import { Catalog } from '../components/Catalog';
import { Services } from '../components/Services';
import { WhyHire } from '../components/WhyHire';
import { MissionVisionValues } from '../components/MissionVisionValues';
import { Contact } from '../components/Contact';

export function Home() {
  return (
    <>
      <Hero />
      <Catalog />
      <Services />
      <WhyHire />
      <MissionVisionValues />
      <Contact />
    </>
  );
}
