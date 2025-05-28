import { Notice } from "@/components";
import {
  AboutUs,
  ExplanationCards,
  HeroSection,
  WhoAreYou,
} from "@/page-sections";
import wording from "@/wording";

export default function Home() {
  return (
    <>
      <Notice
        className="fr-notice--info"
        description={wording.layout.notice.description}
        title={wording.layout.notice.title}
      />
      <div className="[&_h2]:text-center">
        <HeroSection />
        <ExplanationCards />
        <AboutUs />
        <WhoAreYou />
      </div>
    </>
  );
}
