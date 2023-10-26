import { Link } from "rakkasjs";
import { MiniSettingsModal } from "./mini-settings/MiniSettings";

interface ToolbarProps {}

export function Toolbar({}: ToolbarProps) {
  return (
    <header
      className="w-full flex gap-4 justify-between  text-primary-content bg-primary
      t  px-2 py-1 sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold">
        Home
      </Link>

      <MiniSettingsModal />
    </header>
  );
}
