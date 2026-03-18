import { useEffect, useState } from "react";
import RuleManagement from "./components/RuleManagment";
import TextProcessing from "./components/TextProcessing";
import LightMode from "./assets/icons/lightmode.svg";
import DarkMode from "./assets/icons/darkmood.svg";

function App() {
  const [dark, setDark] = useState(true);

  // load theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved) {
      setDark(saved === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setDark(prefersDark);
    }
  }, []);

  // save theme
  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-12 lg:py-12">
          {/* HEADER */}
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-50">
                Rule-Based Content Filter
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Manage rules and preview results
              </p>
            </div>

            {/*  TOGGLE BUTTON */}
            <button
              onClick={() => setDark(!dark)}
              className="btn btn-secondary flex items-center gap-2 w-fit"
            >
              {dark ? (
                <>
                  <img src={LightMode} alt="Light Mode" className="h-5 w-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <img src={DarkMode} alt="Dark Mode" className="h-5 w-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </header>

          {/* CONTENT */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
            <RuleManagement />
            <TextProcessing />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
