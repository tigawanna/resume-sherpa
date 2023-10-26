import { isLinkCurrentPathname } from "@/utils/async";
import { Bookmark, ClipboardCheck, FileSearch2, GraduationCap, HelpingHand, LayoutDashboard, Pencil, Presentation, Trophy, UserCircle } from "lucide-react";
import { StyledLink, usePageContext } from "rakkasjs";


interface SimpleLinksProps {

}

export function SimpleLinks({}:SimpleLinksProps){
    const page_ctx = usePageContext();
    const url = page_ctx.url;
    const links = [
      { name: "/", href: "/", icon: LayoutDashboard },
      { name: "user", href: "/user", icon: Presentation },
      { name: "client", href: "/client", icon:Trophy },
      // { name: "experience", href: "/dashboard/experience", icon:ClipboardCheck },
      // { name: "internship", href: "/dashboard/internship", icon:HelpingHand },
      // { name: "content", href: "/dashboard/content", icon:Bookmark },
      // { name: "education", href: "/dashboard/education", icon:GraduationCap },
      // { name: "job application", href: "/dashboard/job", icon:FileSearch2 },

    ];
    

    return (
  <div className="w-full">
    <nav className="h-full p-2 flex  items-center gap-4">
      {links.map((link) => {
        return (
          <StyledLink
            key={link.name}
            // about={link.name}
            // hidden={isLinkCurrentPathname(link.href, url)}
            href={isLinkCurrentPathname(link.href, url) ? "" : link.href}
            className="p-1 hover:text-accent w-full bg-base-100 rounded group "
            activeClass="text-accent border border-b-accent"
            onClick={() => {
              document && document?.getElementById("my-drawer")?.click();
            }}
          >
            <div className="flex gap-1 justify-between x">
              <button
                className="md:tooltip hover:md:tooltip-open md:tooltip-right flex"
                data-tip={link.name}
              >
          
                <link.icon className="w-4 h-4" />
              </button>
              <div className=" flex justify-end p-2 animate-in ">
                {link.name}
              </div>
            </div>
          </StyledLink>
        );
      })}
    </nav>
  </div>
);
}
