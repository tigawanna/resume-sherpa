import { Toolbar } from "@/components/navigation/Toolbar";
import { Nprogress } from "@/components/navigation/nprogress/Nprogress";
import { LayoutProps, PageContext, useLocation } from "rakkasjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  return (
    <div className="w-full min-h-screen h-full flex flex-col items-center ">
      {/* <Head description={"Resume building assistant"} /> */}
      <Nprogress isAnimating={location && location?.pending ? true : false} />
      <Toolbar />
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
Layout.preload = (ctx: PageContext) => {
  return {
    head: {
      title: "Sherpa Rakkas",
      description: "Resume building assistant",
    },
  };
};

export default Layout;
