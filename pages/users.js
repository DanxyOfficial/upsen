import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserCard from '../components/UserCard';
import { Users, Search, Filter, Calendar } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rank');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, sortBy]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leaderboard?limit=200');
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let result = [...users];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(user =>
        user.userId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort users
    result.sort((a, b) => {
      switch (sortBy) {
        case 'usage':
          return b.totalUsage - a.totalUsage;
        case 'days':
          return b.activeDays - a.activeDays;
        case 'recent':
          return new Date(b.lastActive) - new Date(a.lastActive);
        case 'score':
          return (b.score || 0) - (a.score || 0);
        default: // 'rank'
          return a.rank - b.rank;
      }
    });

    setFilteredUsers(result);
  };

  return (
    <>
      <Head>
        <title>All Users - Upsen Tools</title>
        <meta name="description" content="Browse all users of Upsen Termux Tools" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">All Users</h1>
                  <p className="text-gray-400">Browse all Upsen Tools users</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-cyan-400">{users.length}</div>
                <div className="text-gray-400">Total Users</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 mb-6">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search users by ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="rank">Sort by Rank</option>
                    <option value="usage">Sort by Usage</option>
                    <option value="days">Sort by Active Days</option>
                    <option value="score">Sort by Score</option>
                    <option value="recent">Sort by Recent Activity</option>
                  </select>
                </div>
                <button
                  onClick={fetchUsers}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg transition-all"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400">
                {users.filter(u => new Date(u.lastActive).toDateString() === new Date().toDateString()).length}
              </div>
              <div className="text-gray-400">Active Today</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-400">
                {users.reduce((sum, user) => sum + user.totalUsage, 