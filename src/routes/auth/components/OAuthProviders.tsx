import { GithubIcon } from "lucide-react";
import { Link } from "rakkasjs";

interface OAuthprovidersProps {}

export function OAuthproviders({}: OAuthprovidersProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5">


      <div className="w-full h-full flex  items-center justify-center gap-2">
        <Link
          href="/api/auth/oauth/github"
          className="btn btn-outline w-[70%]  "
          prefetch="never"
        >
          Login with <GithubIcon className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
