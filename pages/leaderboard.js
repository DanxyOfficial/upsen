import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Trophy, Filter, Download, RefreshCw } from 'lucide-react';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leaderboard?limit=100');
      const data = await res.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaderboard = leaderboard.filter(user => {
    if (filter === 'top_10') return user.rank <= 10;
    if (filter === 'with_badges') return user.badges && user.badges.length > 0;
    if (filter === 'active_today') {
      const today = new Date().toISOString().split('T')[0];
      const lastActive = new Date(user.lastActive).toISOString().split('T')[0];
      return lastActive === today;
    }
    if (search) {
      return user.userId.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ['Rank', 'User ID', 'Total Usage', 'Active Days', 'Score', 'Badges', 'Last Active'];
    const csvData = filteredLeaderboard.map(user => [
      user.rank,
      user.userId,
      user.totalUsage,
      user.activeDays,
      Math.round(user.score || 0),
      user.badges?.join(', ') || '',
      new Date(user.lastActive).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `upsen-leaderboard-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <>
      <Head>
        <title>Leaderboard - Upsen Tools</title>
        <meta name="description" content="Global leaderboard for Upsen Termux Tools users" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500/20 to-amber-600/10 mb-4">
              <Trophy className="w-10 h-10 text-yellow-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Global <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Leaderboard</span>
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              See who's leading the pack in using Upsen Termux Tools
            </p>
            
            {/* Controls */}
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search user..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-4 py-2 pl-10 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <Filter className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
              </div>
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="top_10">Top 10 Only</option>
                <option value="with_badges">With Badges</option>
                <option value="active_today">Active Today</option>
              </select>
              
              <div className="flex space-x-2">
                <button
                  onClick={fetchLeaderboard}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg flex items-center space-x-2 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={exportCSV}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg flex items-center space-x-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-700 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="py-4 px-6 text-left">Rank</th>
                      <th className="py-4 px-6 text-left">User</th>
                      <th className="py-4 px-6 text-left">Usage</th>
                      <th className="py-4 px-6 text-left">Active Days</th>
                      <th className="py-4 px-6 text-left">Score</th>
                      <th className="py-4 px-6 text-left">Badges</th>
                      <th className="py-4 px-6 text-left">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredLeaderboard.map((user) => (
                      <tr 
                        key={user.userId}
                        className="hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
                            user.rank === 1 ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 text-yellow-400' :
                            user.rank === 2 ? 'bg-gradient-to-br from-gray-400/20 to-gray-500/10 text-gray-300' :
                            user.rank === 3 ? 'bg-gradient-to-br from-amber-700/20 to-amber-800/10 text-amber-400' :
                            'bg-gray-800 text-gray-400'
                          }`}>
                            <span className="font-bold">#{user.rank}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 mr-3"></div>
                            <div>
                              <div className="font-semibold">{user.userId}</div>
                              <div className="text-xs text-gray-500">
                                Joined {new Date(user.joinDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-lg font-bold">{user.totalUsage}</div>
                          <div className="text-xs text-gray-500">total uses</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-lg font-bold">{user.activeDays}</div>
                          <div className="text-xs text-gray-500">days active</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-lg font-bold text-cyan-400">
                            {Math.round(user.score || 0)}
                          </div>
                          <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                              style={{ width: `${Math.min(100, (user.score || 0) / 10)}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1">
                            {user.badges?.slice(0, 3).map((badge, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 text-xs bg-gradient-to-r from-cyan-800/30 to-blue-800/30 rounded-full"
                                title={badge}
                              >
                                {badge.split('_')[0]}
                              </span>
                            ))}
                            {user.badges?.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{user.badges.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">{new Date(user.lastActive).toLocaleString()}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(user.lastActive).toLocaleDateString() === new Date().toLocaleDateString() 
                              ? 'Today' 
                              : `${Math.floor((new Date() - new Date(user.lastActive)) / (1000 * 60 * 60 * 24))} days ago`}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Stats Summary */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/10 rounded-xl p-6 border border-cyan-500/20">
              <div className="text-2xl font-bold text-cyan-400">{filteredLeaderboard.length}</div>
              <div className="text-gray-400">Users Displayed</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/10 rounded-xl p-6 border border-purple-500/20">
              <div className="text-2xl font-bold text-purple-400">
                {filteredLeaderboard.reduce((sum, user) => sum + user.totalUsage, 0)}
              </div>
              <div className="text-gray-400">Total Usage</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 rounded-xl p-6 border border-green-500/20">
              <div className="text-2xl font-bold text-green-400">
                {Math.round(filteredLeaderboard.reduce((sum, user) => sum + (user.score || 0), 0) / filteredLeaderboard.length) || 0}
              </div>
              <div className="text-gray-400">Average Score</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/20 to-amber-900/10 rounded-xl p-6 border border-yellow-500/20">
              <div className="text-2xl font-bold text-yellow-400">
                {filteredLeaderboard.filter(u => u.rank <= 10).length}
              </div>
              <div className="text-gray-400">Top 10 Users</div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}