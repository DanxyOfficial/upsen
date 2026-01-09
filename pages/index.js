import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import UserCard from '../components/UserCard';
import Leaderboard from '../components/Leaderboard';
import BadgeSystem from '../components/BadgeSystem';
import Footer from '../components/Footer';

export default function Home() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 5,
    activeToday: 5,
    totalUsage: 2450,
    daysUntilReset: 30
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    // Refresh setiap 30 detik untuk data real-time
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setError(null);
    try {
      const [leaderboardRes, statsRes] = await Promise.allSettled([
        fetch('/api/leaderboard'),
        fetch('/api/user/stats')
      ]);
      
      if (leaderboardRes.status === 'fulfilled') {
        const leaderboardData = await leaderboardRes.value.json();
        if (leaderboardData.success) {
          setLeaderboard(leaderboardData.data || []);
        }
      }
      
      if (statsRes.status === 'fulfilled') {
        const statsData = await statsRes.value.json();
        if (statsData.success) {
          setStats(statsData);
        }
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Using demo data.');
      
      // Fallback data
      const fallbackLeaderboard = [
        {
          userId: 'admin',
          joinDate: new Date().toISOString(),
          totalUsage: 1000,
          activeDays: 30,
          lastActive: new Date().toISOString(),
          badges: ['champion', 'power_user', 'top_10'],
          rank: 1,
          score: 1500
        },
        {
          userId: 'user123',
          joinDate: new Date(Date.now() - 86400000 * 7).toISOString(),
          totalUsage: 500,
          activeDays: 20,
          lastActive: new Date().toISOString(),
          badges: ['heavy_user', 'weekly_hero'],
          rank: 2,
          score: 1200
        },
        {
          userId: 'termux_user',
          joinDate: new Date(Date.now() - 86400000 * 3).toISOString(),
          totalUsage: 100,
          activeDays: 3,
          lastActive: new Date().toISOString(),
          badges: ['newbie'],
          rank: 3,
          score: 800
        }
      ];
      setLeaderboard(fallbackLeaderboard);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Upsen Tools - User Activity Dashboard</title>
        <meta name="description" content="Real-time tracking and leaderboard for Upsen Termux Tools users" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <Header />
        
        {error && (
          <div className="bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 px-4 py-3 rounded-lg mx-4 mt-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error} API sedang offline, menampilkan data contoh.</span>
            </div>
          </div>
        )}
        
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="mb-12 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Upsen Tools Dashboard
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Real-time tracking of Termux tools users • Global leaderboard • Achievement system
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-cyan-500/20">
                <h3 className="text-2xl font-bold text-cyan-400">{stats.totalUsers || 5}</h3>
                <p className="text-gray-400">Total Users</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
                <h3 className="text-2xl font-bold text-blue-400">{stats.activeToday || 5}</h3>
                <p className="text-gray-400">Active Today</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-2xl font-bold text-purple-400">{stats.totalUsage || 2450}</h3>
                <p className="text-gray-400">Total Usage</p>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Leaderboard */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                    🏆 Global Leaderboard
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm text-gray-400">Live Updates</span>
                  </div>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                  </div>
                ) : (
                  <Leaderboard data={leaderboard.slice(0, 10)} />
                )}
                
                <div className="mt-6 text-center">
                  <a 
                    href="/leaderboard" 
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg font-semibold transition-all transform hover:scale-105"
                  >
                    View Full Leaderboard
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Badge System & Stats */}
            <div className="space-y-8">
              <BadgeSystem />
              
              <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">📊 Quick Stats</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Leaderboard Reset</p>
                    <p className="text-lg font-semibold">Every 30 days</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Next Reset</p>
                    <p className="text-lg font-semibold">In {stats.daysUntilReset || 30} days</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">API Status</p>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                      <p className="text-green-400 font-semibold">Operational</p>
                    </div>
                  </div>
                </div>
                
                {/* API Test Button */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <a 
                    href="/api/user/login?userId=test_user" 
                    target="_blank"
                    className="block text-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg transition-all"
                  >
                    Test API Endpoint
                  </a>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Click to test API response
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <section className="mt-12">
            <h2 className="text-3xl font-bold mb-6 text-center">👥 Recent Active Users</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {leaderboard.slice(0, 8).map((user, index) => (
                <UserCard key={user.userId || index} user={user} index={index} />
              ))}
            </div>
          </section>
          
          {/* API Documentation */}
          <section className="mt-16 bg-gray-900/50 rounded-2xl p-8 border border-cyan-500/20">
            <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400">🔧 API Integration Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">For Termux Tools</h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm text-green-400">
                    curl -X POST "https://upsen-liart.vercel.app/api/user/login" \<br/>
                    &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
                    &nbsp;&nbsp;-d '{"{ \"userId\": \"$(whoami)\" }"}'
                  </code>
                </div>
                <p className="text-gray-400 mt-2 text-sm">
                  Add this to your Termux tools script to track user activity
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Quick Test</h3>
                <p className="text-gray-300 mb-4">
                  Test the API directly from browser:
                </p>
                <div className="space-y-2">
                  <a 
                    href="/api/user/login?userId=termux_test" 
                    target="_blank"
                    className="block px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg text-center"
                  >
                    Test with userId: termux_test
                  </a>
                  <a 
                    href="/api/leaderboard" 
                    target="_blank"
                    className="block px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-center"
                  >
                    View Leaderboard API
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}