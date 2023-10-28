import { Projects } from "./components/Projects";

interface ProjectPageProps {}

export default function ProjectPage({}: ProjectPageProps) {
  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center">
      <Projects />
    </div>
  );
}
