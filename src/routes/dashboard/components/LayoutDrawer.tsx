import { MenuIcon } from "lucide-react";
import { DashBoardLinks } from "./DashBoardLinks";
import { Link } from "rakkasjs";


interface LayoutDrawerProps {

}

export function DashboardSidebar({}:LayoutDrawerProps){

return (
  <div className="drawer">
    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
    <div className="drawer-content">
      {/* Page content here */}
      <label htmlFor="my-drawer" className="drawer-button">
        <MenuIcon className="w-7 h-7" />
      </label>
    </div>
    <div className="drawer-side">
      <label
        htmlFor="my-drawer"
        aria-label="close sidebar"
        className="drawer-overlay "
      ></label>
      <div className="h-full min-w-[60%] flex flex-col gap-1 z-50 bg-base-100/80">
        <Link href="/" className="text-2xl font-bold bg-primary p-1">
          Home
        </Link>
        <DashBoardLinks />
        {/* <ThemeToggle />
        <CurrentUserSection  /> */}
      </div>
      
    </div>
  </div>
);
}
