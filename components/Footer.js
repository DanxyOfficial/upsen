import { Github, Heart, Coffee, Code } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-gray-800 bg-gradient-to-t from-black to-gray-900/20">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Upsen Tools</h3>
                <p className="text-sm text-gray-400">Termux Utility Dashboard</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Real-time tracking system for Termux tools users with leaderboard and achievement system.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Coffee className="w-4 h-4" />
                <span>Powered by Next.js + Vercel</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/" 
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a 
                  href="/leaderboard" 
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Leaderboard
                </a>
              </li>
              <li>
                <a 
                  href="/users" 
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  All Users
                </a>
              </li>
              <li>
                <a 
                  href="/api-docs" 
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* API Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">API Integration</h4>
            <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
              <code className="text-sm text-cyan-300 block mb-2">
                POST /api/user/login
              </code>
              <p className="text-xs text-gray-400">
                Send user activity from Termux tools
              </p>
            </div>
            <div className="text-sm text-gray-400">
              <p>Need help with integration?</p>
              <p>Check the documentation or contact support.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} Upsen Tools Dashboard. All rights reserved.
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-sm">Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span className="text-gray-500 text-sm">for Termux community</span>
          </div>
        </div>
      </div>
    </footer>
  );
}