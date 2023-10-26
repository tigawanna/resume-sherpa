import { Link } from 'rakkasjs';
import { Footer } from './Footer';

interface LastStepProps {}

export function LastStep({}: LastStepProps) {
  return (
    <div className="w-full min-h-screen h-full flex-col flex items-center justify-between">
      <div className="w-full h-full flex items-center justify-center max-h-[80%] p-10">
        <video
          className="w-full lg:w-[40%]"
          controls
          width="480"
          height="360"
          autoPlay
        >
          <source
            src="/sherpa/video/create-resume.mp4"
            type="video/mp4"
          ></source>
        </video>
      </div>
      <div className="flex flex-col justify-center p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
        <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
          <Link href="/dashboard" className="btn btn-primary">
            Get Started
          </Link>

        </div>
      </div>
    <Footer/>
    </div>
  );
}
