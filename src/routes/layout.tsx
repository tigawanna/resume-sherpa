import { Toolbar } from "@/components/navigation/Toolbar";
import { Nprogress } from "@/components/navigation/nprogress/Nprogress";
import { ClientSuspense, Head, LayoutProps, PageContext, useLocation } from "rakkasjs";
import { ToastContainer } from "react-toastify";
import "./index.css";
import "cherry-markdown/dist/cherry-markdown.css";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  return (
    <div className="w-full min-h-screen h-full flex flex-col items-center ">
      {/* <Head description={"Resume building assistant"} /> */}
      <ClientSuspense fallback={<div></div>} >
        <Nprogress isAnimating={location && location?.pending ? true : false} />
      </ClientSuspense>
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
      {import.meta.env.DEV && (
        <ReactQueryDevtoolsProduction/>
      )}
    </div>
  );
}
Layout.preload = (ctx: PageContext) => {
  return {
    head: {
      title: "Sherpa",
      keywords:
        "job-specific resume, cover letter, AI-powered, resume builder, cover letter builder, resume feedback, cover letter feedback",
      description:
        " Sherpa is the AI-powered platform that helps you build job-specific resumes and cover letters that will get you noticed. With Sherpa, you can quickly and easily create a resume and cover letter tailored to each job you apply for, highlight your most relevant skills and experience, and get feedback from experts to make sure your resume and cover letter are polished and professional",
    },
  };
};

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
);

export default Layout;
