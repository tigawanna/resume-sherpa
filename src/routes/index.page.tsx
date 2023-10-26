import { PageProps } from "rakkasjs";
import { WelcomeSection } from "./welcome/Welcome";

export default function HomePage({}: PageProps) {
return (
    <main className="flex flex-col items-center w-full min-h-screen h-full gap-3">
      <WelcomeSection />
    </main>
  );
}
