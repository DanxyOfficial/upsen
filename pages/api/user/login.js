import { db } from '../../../lib/database';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let { userId } = req.body;

    // Jika tidak ada body, coba dari query string
    if (!userId && req.query.userId) {
      userId = req.query.userId;
    }

    if (!userId) {
      return res.status(400).json({ 
        success: false,
        error: 'User ID is required',
        message: 'Please provide userId parameter'
      });
    }

    // Validasi userId (whoami dari Termux)
    if (typeof userId !== 'string' || userId.length > 50) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a string (max 50 chars)'
      });
    }

    // Clean user ID (remove special chars)
    const cleanUserId = userId.replace(/[^a-zA-Z0-9_\-.]/g, '_');

    // Add or update user
    const user = db.addUser(cleanUserId);
    
    // Get updated leaderboard position
    const leaderboard = db.getLeaderboard();
    const userRank = leaderboard.find(u => u.userId === cleanUserId)?.rank || 0;
    
    // Get stats
    const stats = db.getStats();

    return res.status(200).json({
      success: true,
      message: 'User activity recorded successfully',
      data: {
        userId: cleanUserId,
        rank: userRank,
        totalUsage: user.totalUsage,
        activeDays: user.activeDays,
        badges: user.badges,
        lastActive: user.lastActive,
        joinDate: user.joinDate
      },
      stats: {
        totalUsers: stats.totalUsers,
        userRank: userRank,
        leaderboardPosition: `${userRank}/${stats.totalUsers}`
      },
      serverTime: new Date().toISOString(),
      apiVersion: '1.0'
    });

  } catch (error) {
    console.error('Login API Error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}