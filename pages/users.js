import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserCard from '../components/UserCard';
import { Users, Search, Filter } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rank');
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    fetchWhoami();
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, sortBy]);

  const fetchWhoami = async () => {
    try {
      const res = await fetch('/api/whoami');
      const data = await res.json();
      if (data.success) {
        setLocalUser(data.user);
      }
    } catch {
      setLocalUser(null);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leaderboard?limit=200');
      const data = await res.json();

      if (data.success) {
        setUsers(mergeLocalUser(data.data || []));
      } else {
        setUsers(mergeLocalUser(getFallbackData()));
      }
    } catch {
      setUsers(mergeLocalUser(getFallbackData()));
    } finally {
      setLoading(false);
    }
  };

  const mergeLocalUser = (list) => {
    if (!localUser) return list;

    const exists = list.some(u => u.userId === localUser);
    if (exists) return list;

    return [
      {
        userId: localUser,
        joinDate: new Date().toISOString(),
        totalUsage: 0,
        activeDays: 1,
        lastActive: new Date().toISOString(),
        badges: ['local_user'],
        rank: list.length + 1,
        score: 0
      },
      ...list
    ];
  };

  const getFallbackData = () => [
    {
      userId: 'admin',
      joinDate: new Date().toISOString(),
      totalUsage: 1000,
      activeDays: 30,
      lastActive: new Date().toISOString(),
      badges: ['champion', 'power_user'],
      rank: 1,
      score: 1500
    }
  ];

  const filterAndSortUsers = () => {
    let result = [...users];

    if (searchTerm) {
      result = result.filter(u =>
        u.userId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'usage':
          return (b.totalUsage || 0) - (a.totalUsage || 0);
        case 'days':
          return (b.activeDays || 0) - (a.activeDays || 0);
        case 'score':
          return (b.score || 0) - (a.score || 0);
        default:
          return (a.rank || 999) - (b.rank || 999);
      }
    });

    setFilteredUsers(result);
  };

  return (
    <>
      <Head>
        <title>Users — Upsen Tools</title>
      </Head>

      <div className="min-h-screen bg-[#0b0f14] text-slate-100">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-12">
          {/* HEADER */}
          <section className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-semibold">All Users</h1>
              <p className="text-slate-400 mt-2">
                {localUser
                  ? `Logged as ${localUser}`
                  : 'Browsing Upsen Tools users'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-cyan-500/10">
              <Users className="w-8 h-8 text-cyan-400" />
            </div>
          </section>

          {/* CONTROLS */}
          <section className="flex flex-col md:flex-row gap-4 justify-between mb-10">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search user ID…"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08]"
              >
                <option value="rank">Rank</option>
                <option value="usage">Usage</option>
                <option value="days">Active Days</option>
                <option value="score">Score</option>
              </select>

              <button
                onClick={fetchUsers}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition"
              >
                Refresh
              </button>
            </div>
          </section>

          {/* GRID */}
          {loading ? (
            <div className="h-64 flex justify-center items-center">
              <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredUsers.map((user, i) => (
                <UserCard
                  key={user.userId || i}
                  user={user}
                  highlight={user.userId === localUser}
                />
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}