import { db } from '../../../lib/database';

export default async function handler(req, res) {
  try {
    const data = db.getData();
    
    // Hitung stats
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const activeToday = data.activities.filter(activity => {
      const activityDate = new Date(activity.timestamp).toISOString().split('T')[0];
      return activityDate === today;
    }).length;

    const totalUsers = data.users.length;
    const totalUsage = data.users.reduce((sum, user) => sum + user.totalUsage, 0);
    
    // Hitung hari hingga reset
    const lastReset = new Date(data.lastReset);
    const nextReset = new Date(lastReset);
    nextReset.setDate(nextReset.getDate() + 30);
    const daysUntilReset = Math.ceil((nextReset - now) / (1000 * 60 * 60 * 24));

    return res.status(200).json({
      totalUsers,
      activeToday,
      totalUsage,
      daysUntilReset,
      lastReset: data.lastReset,
      nextReset: nextReset.toISOString()
    });

  } catch (error) {
    console.error('Stats API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}