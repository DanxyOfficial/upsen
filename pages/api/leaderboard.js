import { db } from '../../lib/database';

export default async function handler(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const leaderboard = db.getLeaderboard(limit);
    
    // Reset otomatis setiap 30 hari
    const data = db.getData();
    const lastReset = new Date(data.lastReset);
    const now = new Date();
    const daysSinceReset = (now - lastReset) / (1000 * 60 * 60 * 24);
    
    if (daysSinceReset >= 30) {
      // Reset leaderboard
      data.lastReset = now.toISOString();
      data.users = data.users.map(user => ({
        ...user,
        totalUsage: 0,
        activeDays: 0,
        rank: 0
      }));
      db.saveData(data);
      
      return res.status(200).json({
        message: 'Leaderboard has been reset for the new period!',
        leaderboard: db.getLeaderboard(limit),
        reset: true
      });
    }
    
    return res.status(200).json(leaderboard);

  } catch (error) {
    console.error('Leaderboard API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}