import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-end">
          <Link 
            href="/experiments"
            className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
          >
            experiments
          </Link>
        </div>
      </div>
    </nav>
  );
}

