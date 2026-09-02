export default function Footer() {
  return (
    <footer className="fixed bottom-4 left-4 right-4 z-40 sm:bottom-6 sm:left-6 sm:right-6 md:left-8 md:right-8 lg:left-12 lg:right-12">
      <div className="flex items-center justify-between px-3 py-2 text-[10px] text-quaternary">
        <div className="flex items-center gap-2">
          <span className="border border-black/30 dark:border-white/30 px-2 py-0.5 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,0.3)] dark:shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,0.2)] bg-transparent">
            © {new Date().getFullYear()}
          </span>
          <span className="hidden sm:inline">Kovid Sharma</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-quaternary">v.2025.12</span>
          <a
            className="border border-black/30 dark:border-white/30 px-2 py-0.5 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,0.3)] dark:shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,0.2)] bg-transparent hover:border-black/50 dark:hover:border-white/50 hover:text-tertiary transition-all duration-150"
            href="https://github.com/kovid-sharma/kovid-sharma.github.io"
            rel="noopener noreferrer"
            target="_blank"
          >
            source ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
