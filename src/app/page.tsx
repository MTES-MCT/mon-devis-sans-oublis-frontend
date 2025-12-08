import { Notice } from "@/components";
import {
  AboutUs,
  ApiBlock,
  HeroSection,
  HowItWorks,
  ProfileCards,
  WhatFor,
  // WhoAreYou,
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
        <WhatFor />
        <ProfileCards />
        <HowItWorks />
        <ApiBlock />
        <AboutUs />
        {/* <WhoAreYou /> */}
      </div>
    </>
  );
}
