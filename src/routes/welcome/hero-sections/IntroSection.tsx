import { Image } from "@unpic/react";
import { Link } from "rakkasjs";

interface IntroSectionProps {

}

export function IntroSection({}:IntroSectionProps){
return (
<section className="w-full h-full flex min-h-screen justify-start items-start">
		<div className="w-full flex flex-col  p-6 mx-auto  lg:flex-row lg:justify-between">
			<div className="flex flex-col justify-center p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
				<h1 className="text-6xl font-bold sm:text-6xl">Sherpa</h1>
				<p className="mt-6 mb-8 text-lg font-normal sm:mb-12">Scaffold out a job specific resume and cover letter ,
                <br />
                Easily create tailored resumes and cover letters for every job application
                    </p>
				<div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
				<Link href="/dashboard" className="btn btn-primary">
                    Get Started
                </Link>
            <Link href="/auth" className="btn btn-primary">
              Or login to continue
            </Link>
				</div>
			</div>
			<div className="w-full lg:w-[40%] h-full min-h-screen flex items-center justify-center ">
				<Image src="svg/Business_SVG.svg" alt="hero business page" layout="fullWidth" 
                className="object-contain w-full max-h-[70%]" />
			</div>
		</div>
	</section>

);
}
