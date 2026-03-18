import RuleManagement from "./components/RuleManagment";
import TextProcessing from "./components/TextProcessing";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-12 lg:py-12">
        <div className="space-y-6 lg:space-y-8">
          <header className="flex flex-col gap-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1 text-xs text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Rules engine dashboard
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-50">
              Rule-Based Content Filter
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
              Manage keyword rules and instantly preview how they apply to text.
            </p>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">
            <RuleManagement />
            <TextProcessing />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;