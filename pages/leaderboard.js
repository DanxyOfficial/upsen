import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  Trophy,
  Download,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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
        setError('Failed to load leaderboard');
        setLeaderboard(getFallbackData());
      }
    } catch {
      setError('Network error');
      setLeaderboard(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackData = () => [
    {
      userId: 'admin',
      totalUsage: 1000,
      activeDays: 30,
      lastActive: new Date().toISOString(),
      badges: ['champion', 'power_user'],
      rank: 1,
      score: 1500
    },
    {
      userId: 'user123',
      totalUsage: 500,
      activeDays: 20,
      lastActive: new Date().toISOString(),
      badges: ['weekly_hero'],
      rank: 2,
      score: 1200
    },
    {
      userId: 'termux_user',
      totalUsage: 100,
      activeDays: 3,
      lastActive: new Date().toISOString(),
      badges: ['newbie'],
      rank: 3,
      score: 800
    }
  ];

  const filtered = leaderboard.filter(u => {
    if (!u) return false;
    if (search && !u.userId?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'top_10') return u.rank <= 10;
    if (filter === 'power') return u.totalUsage >= 100;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const pageData = filtered.slice(start, start + itemsPerPage);

  const exportCSV = () => {
    const rows = filtered.map(u =>
      [u.rank, u.userId, u.totalUsage, u.activeDays, u.score].join(',')
    );
    const blob = new Blob(
      [['Rank,User,Usage,Days,Score', ...rows].join('\n')],
      { type: 'text/csv' }
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'leaderboard.csv';
    a.click();
  };

  return (
    <>
      <Head>
        <title>Leaderboard — Upsen Tools</title>
      </Head>

      <div className="min-h-screen bg-[#0b0f14] text-slate-100">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-12">
          {/* HEADER */}
          <section className="text-center max-w-3xl mx-auto mb-16">
            <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-cyan-500/10">
              <Trophy className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold">
              Global
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Leaderboard
              </span>
            </h1>
            <p className="text-slate-400 mt-4">
              Ranked usage activity across all Upsen tools users
            </p>
          </section>

          {/* CONTROLS */}
          <section className="flex flex-col md:flex-row gap-4 justify-between mb-8">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search user…"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08]"
              >
                <option value="all">All</option>
                <option value="top_10">Top 10</option>
                <option value="power">Power Users</option>
              </select>

              <button
                onClick={fetchLeaderboard}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={exportCSV}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* TABLE */}
          <section className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-white/[0.03]">
                  <tr>
                    {['Rank', 'User', 'Usage', 'Days', 'Score'].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-sm text-slate-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageData.map(u => (
                    <tr
                      key={u.userId}
                      className="border-t border-white/[0.06] hover:bg-white/[0.04] transition"
                    >
                      <td className="px-6 py-4 font-semibold">#{u.rank}</td>
                      <td className="px-6 py-4">{u.userId}</td>
                      <td className="px-6 py-4">{u.totalUsage}</td>
                      <td className="px-6 py-4">{u.activeDays}</td>
                      <td className="px-6 py-4 text-cyan-400 font-semibold">
                        {Math.round(u.score)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-2 rounded-lg bg-white/[0.04]"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="px-4 py-2 text-slate-400">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-2 rounded-lg bg-white/[0.04]"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}