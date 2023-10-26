import { Spinner } from "@/components/navigation/loaders/Spinner";
import { ClientSuspense, LayoutProps } from "rakkasjs";
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center">
      <ClientSuspense fallback={<Spinner size="100px" />}>
        {children}
      </ClientSuspense>
    </div>
  );
}
