import Link from "next/link";

export default function ExperimentsPage() {
  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 mb-12">
          experiments
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link 
            href="/experiments/scraper"
            className="group block p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
              scraper
            </h2>
          </Link>
          
          <Link 
            href="/experiments/extract"
            className="group block p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
              extract
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
}

