import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-6">
            <a
              className="group rounded-full border border-white/10 bg-white/5 p-4 shadow-lg shadow-slate-900/40 transition hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-white/10"
              href="https://vite.dev"
              target="_blank"
            >
              <img
                src={viteLogo}
                className="h-14 w-14 drop-shadow-[0_0_16px_rgba(34,211,238,0.35)] transition group-hover:scale-105"
                alt="Vite logo"
              />
            </a>
            <a
              className="group rounded-full border border-white/10 bg-white/5 p-4 shadow-lg shadow-slate-900/40 transition hover:-translate-y-1 hover:border-indigo-300/50 hover:bg-white/10"
              href="https://react.dev"
              target="_blank"
            >
              <img
                src={reactLogo}
                className="h-14 w-14 drop-shadow-[0_0_16px_rgba(129,140,248,0.35)] transition group-hover:scale-105"
                alt="React logo"
              />
            </a>
          </div>
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/80">
              Tailwind Ready
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Vite + React, now with Tailwind
            </h1>
            <p className="text-base text-slate-300 sm:text-lg">
              Compose UI faster with utility classes and keep the visual polish.
            </p>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-slate-950/50">
            <h2 className="text-lg font-semibold text-white">Interactive counter</h2>
            <p className="mt-2 text-sm text-slate-300">
              Confirm everything is wired up while you start building the product UI.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <button
                className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:bg-cyan-300"
                onClick={() => setCount((count) => count + 1)}
              >
                Increment
              </button>
              <span className="text-sm text-slate-200">
                Count: <span className="font-semibold text-white">{count}</span>
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-8">
            <p className="text-sm text-slate-400">Next steps</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li>Swap `src/App.tsx` markup for your first screen.</li>
              <li>Drop components into `apps/web/src` as you go.</li>
              <li>Extend Tailwind with brand colors in `tailwind.config.js`.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
