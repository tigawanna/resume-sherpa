import { Image } from "@unpic/react";
import { Link } from "rakkasjs";

interface IntroSectionProps {}

export function IntroSection({}: IntroSectionProps) {
  return (
    <section className="w-full h-full flex min-h-screen justify-start items-start">
      <div className="w-full flex flex-col p-5 sm:p-6 sm:mx-auto  lg:flex-row lg:justify-between gap-5">
        <div className="flex min-h-[450px] flex-col justify-center sm:p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
          <h1 className="text-8xl font-bold sm:text-8xl">Sherpa</h1>
          <p className="mt-6 mb-8  font-normal sm:text-lg sm:mb-12">
            Sherpa is the AI-powered platform that helps you build job-specific
            resumes and cover letters that will get you noticed.
            <br />
            
          </p>
          <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
            <Link href="/dashboard" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
        <div className="w-full lg:w-[40%] h-full sm:min-h-screen flex items-center justify-center ">
          <Image
            src="svg/Business_SVG.svg"
            alt="hero business page"
            layout="fullWidth"
            className="object-contain w-full max-h-[70%]"
          />
        </div>
      </div>
    </section>
  );
}
