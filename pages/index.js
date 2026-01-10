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
    } catch (err) {
      setError('Failed to load data. Using demo data.');
      setLeaderboard([
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
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Upsen Tools — User Dashboard</title>
        <meta name="description" content="Professional real-time dashboard for Upsen Termux Tools" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#0b0f14] text-slate-100">
        <Header />

        {error && (
          <div className="max-w-6xl mx-auto mt-6 px-4">
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-yellow-300 text-sm">
              {error} API offline, menampilkan data contoh.
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 py-12">
          {/* HERO */}
          <section className="text-center max-w-4xl mx-auto mb-20">
            <span className="inline-block mb-4 px-4 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm">
              Real-time Monitoring System
            </span>

            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6">
              Upsen Tools
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                User Activity Dashboard
              </span>
            </h1>

            <p className="text-lg text-slate-400">
              Live analytics, leaderboard global, dan sistem badge
              untuk ekosistem tools berbasis Termux.
            </p>
          </section>

          {/* STATS */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {[
              { label: 'Total Users', value: stats.totalUsers },
              { label: 'Active Today', value: stats.activeToday },
              { label: 'Total Usage', value: stats.totalUsage }
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 backdrop-blur-xl"
              >
                <p className="text-sm text-slate-400 mb-2">{item.label}</p>
                <p className="text-3xl font-semibold">{item.value}</p>
              </div>
            ))}
          </section>

          {/* MAIN GRID */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEADERBOARD */}
            <div className="lg:col-span-2 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">🏆 Global Leaderboard</h2>
                <span className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live
                </span>
              </div>

              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
                  <p className="text-sm text-slate-400">Syncing data…</p>
                </div>
              ) : (
                <Leaderboard data={leaderboard.slice(0, 10)} />
              )}
            </div>

            {/* SIDE */}
            <div className="space-y-8">
              <BadgeSystem />

              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6">
                <h3 className="text-xl font-semibold mb-4">📊 System Info</h3>

                <div className="space-y-3 text-sm text-slate-400">
                  <p>Leaderboard reset setiap 30 hari</p>
                  <p>Reset berikutnya: <span className="text-white">{stats.daysUntilReset} hari</span></p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    API Operational
                  </p>
                </div>

                <a
                  href="/api/user/login?userId=test_user"
                  target="_blank"
                  className="mt-6 block text-center rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 py-2 font-medium hover:opacity-90 transition"
                >
                  Test API Endpoint
                </a>
              </div>
            </div>
          </section>

          {/* RECENT USERS */}
          <section className="mt-20">
            <h2 className="text-2xl font-semibold text-center mb-8">
              👥 Recent Active Users
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {leaderboard.slice(0, 8).map((user, i) => (
                <UserCard key={user.userId || i} user={user} index={i} />
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}