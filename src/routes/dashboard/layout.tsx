import { ClientSuspense, LayoutProps } from "rakkasjs";
import { DashboardSidebar } from "./components/LayoutDrawer";
import { DashBoardLinks } from "./components/DashBoardLinks";
import { Spinner } from "@/components/navigation/loaders/Spinner";

export default function DashboardLayout({ children,url }: LayoutProps) {
  // const user =useUser();
  return (
    <div className="w-full h-full min-h-screen flex">
      <div className="h-full sticky top-10  hidden md:flex bg-base-300">
        <DashBoardLinks />
      </div>
      <div className="fixed top-10 left-1 z-50  md:hidden bg-base-300">
        <DashboardSidebar />
      </div>
      <ClientSuspense
        fallback={
          <div className="min-h-screen w-full flex items-center justify-center">
            <Spinner size="100px" />
          </div>
        }
      >
        <div className="min-h-screen w-full flex items-center justify-center ">
          {children}
        </div>
      </ClientSuspense>
    </div>
  );
}
