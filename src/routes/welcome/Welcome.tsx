import { IntroSection } from "./hero-sections/IntroSection";
import { DescriptionBulletPoints } from "./hero-sections/DescriptionBulletPoints";
import { LastStep } from "./hero-sections/LastStep";


interface WelcomePageProps {}

export function WelcomeSection({}: WelcomePageProps) {
  return (
    <div className="w-full h-full min-h-screen bg-base-300 text-base-content">
    <IntroSection/>
      <DescriptionBulletPoints/>
      <LastStep/>
    </div>
  );
}
