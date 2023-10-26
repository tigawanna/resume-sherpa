import { IntroSection } from "./hero-sections/IntroSection";
import { DescriptionBulletPoints } from "./hero-sections/DescriptionBulletPoints";
import { LastStep } from "./hero-sections/LastStep";


interface WelcomePageProps {}

export function WelcomeSection({}: WelcomePageProps) {
  return (
    <div className="w-full h-full min-h-screen bg-base-300 text-base-content">
      {/* <div className="hero-content text-center">
        <div className="min-h-[200px] flex flex-col justify-evenly items-center gap-5">
          <h1 className="text-6xl font-bold">Welcome To Sherpa</h1>
          <p className="text-2xl text-base-content/80 ">
            Your smart job application assistant
          </p>
          <Features />

          <div className="flex  gap-10">
            <Link href="/dashboard" className="btn btn-primary">
              Get Started
            </Link>
            <Link href="/auth" className="btn btn-primary">
              Or login to continue
            </Link>
          </div>
        </div>
      </div> */}
      {/* <HeroSection/> */}
      <IntroSection/>
      <DescriptionBulletPoints/>
      <LastStep/>
    </div>
  );
}
