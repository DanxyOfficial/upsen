import { db } from '../../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Validasi userId (whoami dari Termux)
    if (typeof userId !== 'string' || userId.length > 50) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Add or update user
    const user = db.addUser(userId);
    
    // Record activity
    db.recordActivity(userId, 'login');

    // Get updated leaderboard position
    const leaderboard = db.getLeaderboard();
    const userRank = leaderboard.find(u => u.userId === userId)?.rank || 0;

    return res.status(200).json({
      success: true,
      message: 'User activity recorded',
      data: {
        userId,
        rank: userRank,
        totalUsage: user.totalUsage,
        badges: user.badges,
        lastActive: user.lastActive
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}