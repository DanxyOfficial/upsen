import { Terminal, Globe, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="p-2 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg">
              <Terminal className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Upsen Tools
              </h1>
              <p className="text-sm text-gray-400">Termux User Dashboard</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-green-400" />
                <span className="text-sm">Live</span>
              </div>
              <div className="h-6 w-px bg-gray-700"></div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-sm">
                  {time.toLocaleTimeString('en-US', { 
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            <nav className="flex space-x-4">
              <a 
                href="/" 
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-700/30 to-blue-700/30 hover:from-cyan-600/40 hover:to-blue-600/40 transition-all"
              >
                Dashboard
              </a>
              <a 
                href="/leaderboard" 
                className="px-4 py-2 rounded-lg hover:bg-gray-800/50 transition-all"
              >
                Leaderboard
              </a>
              <a 
                href="/users" 
                className="px-4 py-2 rounded-lg hover:bg-gray-800/50 transition-all"
              >
                All Users
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}