import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
interface ThemeToggleModalProps {}

export function ThemeToggle({}: ThemeToggleModalProps) {

  const [theme, setTheme] = useState<string>(""); 
  useEffect(() => {
  if (window) {
      const initialTheme =
      document?.documentElement?.getAttribute("data-theme");
      const isDarkMode = window?.matchMedia(
        "(prefers-color-scheme: dark)",
      )?.matches; 
     setTheme(initialTheme ?? (isDarkMode ? "dark" : "light")??"light"); 
    }
  }, []);

  const handleThemeChange = (newTheme: string) => {
    if (window) {
      setTheme(newTheme);
      document?.documentElement?.setAttribute("data-theme", newTheme);
      document.cookie = `theme=${newTheme}`;
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-1 p-2">

      {theme === "dark" ? (
        <Sun className="h-6 w-6" onClick={() => handleThemeChange("light")} />
      ) : (
        <Moon className="h-6 w-6" onClick={() => handleThemeChange("dark")} />
      )}
    </div>
  );
}
