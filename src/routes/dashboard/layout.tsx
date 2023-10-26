import { LayoutProps } from "rakkasjs";
import { DashboardSidebar } from "./components/LayoutDrawer";
import { DashBoardLinks } from "./components/DashBoardLinks";
import { Suspense } from "react";

import { Spinner } from "@/components/navigation/loaders/Spinner";
export default function DashboardLayout({ children,url }: LayoutProps) {
  return (
    <div className="w-full h-full min-h-screen  flex">
      <div className="h-full sticky top-10  hidden md:flex bg-base-300">
        <DashBoardLinks />
      </div>
      <div className="fixed top-10 left-1 z-50  md:hidden bg-base-300">
        <DashboardSidebar />
      </div>
    <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center"><Spinner size="100px"/>
      </div>
    }>
      {children}
    </Suspense>
    </div>
  );
}
