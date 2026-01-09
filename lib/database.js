// Simulasi database dengan JSON (untuk produksi gunakan MongoDB/PostgreSQL)
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'database.json');

// Inisialisasi database
const initializeDB = () => {
  const defaultData = {
    users: [],
    activities: [],
    leaderboard: [],
    lastReset: new Date().toISOString()
  };

  if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
  }
};

// Fungsi helper untuk database
export const db = {
  getData: () => {
    initializeDB();
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  },

  saveData: (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  },

  addUser: (userId) => {
    const data = db.getData();
    const existingUser = data.users.find(u => u.userId === userId);

    if (!existingUser) {
      const newUser = {
        userId,
        joinDate: new Date().toISOString(),
        totalUsage: 0,
        activeDays: 0,
        lastActive: new Date().toISOString(),
        badges: ['newbie'],
        rank: 0
      };
      data.users.push(newUser);
      db.saveData(data);
      return newUser;
    }

    // Update existing user
    existingUser.totalUsage += 1;
    existingUser.lastActive = new Date().toISOString();
    
    // Check for new badges
    updateBadges(existingUser);
    
    db.saveData(data);
    return existingUser;
  },

  recordActivity: (userId, action) => {
    const data = db.getData();
    data.activities.push({
      userId,
      action,
      timestamp: new Date().toISOString()
    });
    db.saveData(data);
  },

  getLeaderboard: (limit = 50) => {
    const data = db.getData();
    
    // Update ranking logic
    const leaderboard = data.users
      .map(user => ({
        ...user,
        score: calculateScore(user)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }));

    return leaderboard;
  }
};

// Fungsi untuk menghitung score
const calculateScore = (user) => {
  const usageScore = user.totalUsage * 0.5;
  const activityScore = user.activeDays * 10;
  const recencyScore = user.lastActive ? 
    Math.max(0, 100 - (Date.now() - new Date(user.lastActive).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  
  return usageScore + activityScore + recencyScore;
};

// Fungsi untuk update badge
const updateBadges = (user) => {
  const badges = user.badges || [];
  
  // Badge based on usage
  if (user.totalUsage >= 100 && !badges.includes('heavy_user')) {
    badges.push('heavy_user');
  }
  if (user.totalUsage >= 1000 && !badges.includes('power_user')) {
    badges.push('power_user');
  }
  
  // Badge based on active days
  if (user.activeDays >= 7 && !badges.includes('weekly_hero')) {
    badges.push('weekly_hero');
  }
  if (user.activeDays >= 30 && !badges.includes('monthly_warrior')) {
    badges.push('monthly_warrior');
  }
  
  // Badge for top users
  if (user.rank <= 10 && !badges.includes('top_10')) {
    badges.push('top_10');
  }
  if (user.rank === 1 && !badges.includes('champion')) {
    badges.push('champion');
  }
  
  user.badges = badges;
};