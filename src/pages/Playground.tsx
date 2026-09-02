import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export default function Playground() {
  const [history, setHistory] = useState<{ command: string; output: string }[]>([
    { command: 'whoami', output: 'Kovid Sharma - AI Engineer & Software Development Engineer at HSBC.' },
    { command: 'skills', output: 'C, C++, React, Next.js, Python, TypeScript, TailwindCSS, AWS, Docker' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      const cmd = input.trim().toLowerCase();
      let out = '';
      
      switch(cmd) {
        case 'whoami': out = 'Kovid Sharma - Software Development Engineer at HSBC.'; break;
        case 'skills': out = 'C, C++, CSS3, Elixir, Go, GraphQL, HTML5, JavaScript, Python, PostgreSQL, Next.js'; break;
        case 'contact': out = 'Email: kovid2020@gmail.com | LinkedIn: kovid-sharma-linkdin'; break;
        case 'clear': setHistory([]); setInput(''); return;
        case 'help': out = 'Available commands: whoami, skills, projects, contact, clear'; break;
        case 'projects': out = 'MLDrills, Pettoo, Ra-Connect, Algo Trade Order Block Detector.'; break;
        default: out = `Command not found: ${cmd}. Type 'help' for available commands.`;
      }
      
      setHistory([...history, { command: input, output: out }]);
      setInput('');
    }
  };

  return (
    <div className="h-[100svh] p-4 sm:p-8">
      <motion.section
        animate={{ opacity: 1 }}
        className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-green-500/20 bg-neutral-950 font-mono text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <header className="flex h-12 shrink-0 items-center border-b border-green-500/20 bg-green-950/20 px-4">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-4 text-xs font-semibold tracking-wider text-green-600">kovid_ai_terminal ~ /var/www</span>
        </header>

        <div className="flex-1 overflow-y-auto p-4 text-sm sm:text-base">
          <div className="mb-6 opacity-75">
            <p>Welcome to KovidOS v1.0.0 (AI Node)</p>
            <p>Type 'help' to see available commands.</p>
          </div>

          {history.map((entry, i) => (
            <div key={i} className="mb-4">
              <div className="flex gap-2">
                <span className="text-blue-400">kovid@ai:~$</span>
                <span>{entry.command}</span>
              </div>
              <div className="mt-1 whitespace-pre-wrap pl-2 text-green-300 opacity-90">
                {entry.output}
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <span className="text-blue-400">kovid@ai:~$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              className="flex-1 bg-transparent text-green-500 outline-none placeholder:text-green-800"
              placeholder="type a command..."
              autoFocus
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </motion.section>
    </div>
  );
}
