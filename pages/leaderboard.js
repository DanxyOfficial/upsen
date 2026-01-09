import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Trophy, Filter, Download, RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/leaderboard?limit=100');
      const data = await res.json();
      
      if (data.success) {
        setLeaderboard(data.data || []);
      } else {
        setError('Failed to load leaderboard data');
        // Fallback data
        setLeaderboard(getFallbackData());
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Network error. Please check your connection.');
      // Fallback data
      setLeaderboard(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackData = () => {
    return [
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
      },
      {
        userId: 'android_user',
        joinDate: new Date(Date.now() - 86400000).toISOString(),
        totalUsage: 50,
        activeDays: 1,
        lastActive: new Date().toISOString(),
        badges: ['newbie'],
        rank: 4,
        score: 600
      },
      {
        userId: 'hacker',
        joinDate: new Date(Date.now() - 86400000 * 14).toISOString(),
        totalUsage: 800,
        activeDays: 14,
        lastActive: new Date().toISOString(),
        badges: ['power_user', 'top_10'],
        rank: 5,
        score: 1400
      },
      {
        userId: 'pro_termux',
        joinDate: new Date(Date.now() - 86400000 * 30).toISOString(),
        totalUsage: 2000,
        activeDays: 30,
        lastActive: new Date().toISOString(),
        badges: ['champion', 'power_user', 'monthly_warrior'],
        rank: 6,
        score: 2200
      }
    ];
  };

  const filteredLeaderboard = leaderboard.filter(user => {
    if (!user) return false;
    
    // Filter by search term
    if (search && user.userId && !user.userId.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    // Apply filters
    switch (filter) {
      case 'top_10':
        return user.rank <= 10;
      case 'with_badges':
        return user.badges && user.badges.length > 0;
      case 'active_today':
        const today = new Date().toDateString();
        const lastActive = user.lastActive ? new Date(user.lastActive).toDateString() : '';
        return lastActive === today;
      case 'power_users':
        return user.totalUsage >= 100;
      default:
        return true;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredLeaderboard.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredLeaderboard.slice(startIndex, startIndex + itemsPerPage);

  const exportCSV = () => {
    const headers = ['Rank', 'User ID', 'Total Usage', 'Active Days', 'Score', 'Badges', 'Last Active'];
    const csvData = filteredLeaderboard.map(user => [
      user.rank || 'N/A',
      user.userId || 'Unknown',
      user.totalUsage || 0,
      user.activeDays || 0,
      Math.round(user.score || 0),
      user.badges?.join(', ') || '',
      user.lastActive ? new Date(user.lastActive).toLocaleString() : 'N/A'
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

  const getBadgeColor = (badge) => {
    switch(badge) {
      case 'champion': return 'bg-gradient-to-r from-yellow-600 to-yellow-800';
      case 'power_user': return 'bg-gradient-to-r from-purple-600 to-pink-600';
      case 'heavy_user': return 'bg-gradient-to-r from-orange-600 to-red-600';
      case 'top_10': return 'bg-gradient-to-r from-amber-600 to-orange-600';
      case 'monthly_warrior': return 'bg-gradient-to-r from-emerald-600 to-green-600';
      case 'weekly_hero': return 'bg-gradient-to-r from-blue-600 to-cyan-600';
      default: return 'bg-gradient-to-r from-gray-600 to-gray-800';
    }
  };

  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500/30 to-amber-500/10';
      case 2: return 'bg-gradient-to-r from-gray-400/30 to-gray-500/10';
      case 3: return 'bg-gradient-to-r from-amber-700/30 to-orange-700/10';
      default: return 'bg-gradient-to-r from-gray-800/50 to-gray-900/30';
    }
  };

  return (
    <>
      <Head>
        <title>Leaderboard - Upsen Tools</title>
        <meta name="description" content="Global leaderboard for Upsen Termux Tools users" />
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
              <span>{error}</span>
            </div>
          </div>
        )}
        
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
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search user..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
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
                <option value="power_users">Power Users (100+ uses)</option>
              </select>
              
              <div className="flex space-x-2">
                <button
                  onClick={fetchLeaderboard}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg flex items-center space-x-2 transition-all transform hover:scale-105"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={exportCSV}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg flex items-center space-x-2 transition-all transform hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/10 rounded-xl p-6 border border-cyan-500/20">
              <div className="text-2xl font-bold text-cyan-400">{filteredLeaderboard.length}</div>
              <div className="text-gray-400">Users Displayed</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/10 rounded-xl p-6 border border-purple-500/20">
              <div className="text-2xl font-bold text-purple-400">
                {filteredLeaderboard.reduce((sum, user) => sum + (user.totalUsage || 0), 0)}
              </div>
              <div className="text-gray-400">Total Usage</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 rounded-xl p-6 border border-green-500/20">
              <div className="text-2xl font-bold text-green-400">
                {filteredLeaderboard.length > 0 
                  ? Math.round(filteredLeaderboard.reduce((sum, user) => sum + (user.score || 0), 0) / filteredLeaderboard.length) 
                  : 0}
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

          {/* Leaderboard Table */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-700 overflow-hidden mb-8">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
              </div>
            ) : filteredLeaderboard.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">No Users Found</h3>
                <p className="text-gray-400 mb-6">
                  {search ? `No users match "${search}"` : 'No users available'}
                </p>
                <button
                  onClick={() => { setSearch(''); setFilter('all'); }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
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
                      {paginatedData.map((user) => (
                        <tr 
                          key={`${user.userId}-${user.rank}`}
                          className={`hover:bg-gray-800/30 transition-colors ${getRankColor(user.rank)}`}
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
                              <div className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center ${
                                user.rank === 1 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                                user.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                                user.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-orange-600' :
                                'bg-gradient-to-br from-cyan-600 to-blue-600'
                              }`}>
                                <span className="font-bold text-white">
                                  {user.userId ? user.userId.charAt(0).toUpperCase() : 'U'}
                                </span>
                              </div>
                              <div>
                                <div className="font-semibold truncate max-w-[150px]">{user.userId || 'Unknown'}</div>
                                <div className="text-xs text-gray-500">
                                  Joined {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-lg font-bold">{user.totalUsage || 0}</div>
                            <div className="text-xs text-gray-500">total uses</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-lg font-bold">{user.activeDays || 0}</div>
                            <div className="text-xs text-gray-500">days active</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-lg font-bold text-cyan-400">
                              {Math.round(user.score || 0)}
                            </div>
                            <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, (user.score || 0) / 30)}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                              {user.badges?.slice(0, 3).map((badge, idx) => (
                                <span 
                                  key={idx}
                                  className={`px-2 py-1 text-xs rounded-full ${getBadgeColor(badge)}`}
                                  title={badge.replace('_', ' ')}
                                >
                                  {badge.split('_')[0]}
                                </span>
                              ))}
                              {user.badges?.length > 3 && (
                                <span className="text-xs text-gray-500 px-2 py-1">
                                  +{user.badges.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm">{user.lastActive ? new Date(user.lastActive).toLocaleString() : 'N/A'}</div>
                            <div className="text-xs text-gray-500">
                              {user.lastActive ? (
                                new Date(user.lastActive).toDateString() === new Date().toDateString() 
                                  ? 'Today' 
                                  : `${Math.floor((new Date() - new Date(user.lastActive)) / (1000 * 60 * 60 * 24))} days ago`
                              ) : 'Unknown'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
                    <div className="text-gray-400">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLeaderboard.length)} of {filteredLeaderboard.length} users
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600'
                                : 'bg-gray-800/50 hover:bg-gray-800'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Top 3 Highlight */}
          {leaderboard.length >= 3 && !loading && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">🎉 Top 3 Champions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {leaderboard.slice(0, 3).map((user, index) => (
                  <div 
                    key={`top-${index}`}
                    className={`rounded-2xl p-6 backdrop-blur-lg border ${
                      index === 0 ? 'border-yellow-500/30 bg-gradient-to-br from-yellow-900/20 to-amber-900/10' :
                      index === 1 ? 'border-gray-400/30 bg-gradient-to-br from-gray-900/20 to-gray-800/10' :
                      'border-amber-700/30 bg-gradient-to-br from-amber-900/20 to-orange-900/10'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-20 h-20 rounded-full mb-4 flex items-center justify-center ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-500 to-amber-600' :
                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                        'bg-gradient-to-br from-amber-600 to-orange-600'
                      }`}>
                        <span className="text-2xl font-bold text-white">
                          {user.userId ? user.userId.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div className={`text-4xl font-bold mb-2 ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-gray-300' :
                        'text-amber-400'
                      }`}>
                        #{user.rank}
                      </div>
                      <h3 className="text-xl font-bold mb-2 truncate max-w-full">{user.userId || 'Unknown'}</h3>
                      <div className="text-gray-300 mb-4">
                        {user.totalUsage || 0} uses • {user.activeDays || 0} days
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {user.badges?.slice(0, 2).map((badge, idx) => (
                          <span 
                            key={idx}
                            className={`px-3 py-1 text-sm rounded-full ${getBadgeColor(badge)}`}
                          >
                            {badge.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API Info */}
          <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/10 rounded-2xl p-8 border border-cyan-500/20">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">🔗 API Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold mb-2">Leaderboard API</h3>
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm text-green-400">
                    GET https://upsen-liart.vercel.app/api/leaderboard<br/>
                    GET https://upsen-liart.vercel.app/api/leaderboard?limit=10
                  </code>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Returns JSON data of all users sorted by rank
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Test Links</h3>
                <div className="space-y-3">
                  <a 
                    href="/api/leaderboard?limit=5" 
                    target="_blank"
                    className="block px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-center transition-all transform hover:scale-105"
                  >
                    View Top 5 (JSON)
                  </a>
                  <a 
                    href="/api/leaderboard?limit=10&format=raw" 
                    target="_blank"
                    className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg text-center transition-all transform hover:scale-105"
                  >
                    View Top 10 (JSON)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}