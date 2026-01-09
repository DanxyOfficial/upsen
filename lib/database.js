// Database in-memory untuk Vercel (tanpa file system)
class UpsenDatabase {
  constructor() {
    this.data = {
      users: [
        // Data contoh untuk development
        {
          userId: 'admin',
          joinDate: new Date().toISOString(),
          totalUsage: 1000,
          activeDays: 30,
          lastActive: new Date().toISOString(),
          badges: ['champion', 'power_user', 'top_10'],
          rank: 1
        },
        {
          userId: 'user123',
          joinDate: new Date(Date.now() - 86400000 * 7).toISOString(),
          totalUsage: 500,
          activeDays: 20,
          lastActive: new Date().toISOString(),
          badges: ['heavy_user', 'weekly_hero'],
          rank: 2
        },
        {
          userId: 'termux_user',
          joinDate: new Date(Date.now() - 86400000 * 3).toISOString(),
          totalUsage: 100,
          activeDays: 3,
          lastActive: new Date().toISOString(),
          badges: ['newbie'],
          rank: 3
        },
        {
          userId: 'android_user',
          joinDate: new Date(Date.now() - 86400000).toISOString(),
          totalUsage: 50,
          activeDays: 1,
          lastActive: new Date().toISOString(),
          badges: ['newbie'],
          rank: 4
        },
        {
          userId: 'hacker',
          joinDate: new Date(Date.now() - 86400000 * 14).toISOString(),
          totalUsage: 800,
          activeDays: 14,
          lastActive: new Date().toISOString(),
          badges: ['power_user', 'top_10'],
          rank: 5
        }
      ],
      activities: [],
      leaderboard: [],
      lastReset: new Date().toISOString()
    };
  }

  // Singleton pattern
  static getInstance() {
    if (!UpsenDatabase.instance) {
      UpsenDatabase.instance = new UpsenDatabase();
    }
    return UpsenDatabase.instance;
  }

  getData() {
    return this.data;
  }

  saveData(data) {
    this.data = { ...data };
  }

  addUser(userId) {
    const existingUser = this.data.users.find(u => u.userId === userId);

    if (!existingUser) {
      const newUser = {
        userId,
        joinDate: new Date().toISOString(),
        totalUsage: 1,
        activeDays: 1,
        lastActive: new Date().toISOString(),
        badges: ['newbie'],
        rank: 0
      };
      this.data.users.push(newUser);
      
      // Tambah activity log
      this.recordActivity(userId, 'register');
      
      return newUser;
    }

    // Update existing user
    existingUser.totalUsage += 1;
    existingUser.lastActive = new Date().toISOString();
    
    // Check if new day
    const lastActiveDate = new Date(existingUser.lastActive).toDateString();
    const today = new Date().toDateString();
    if (lastActiveDate !== today) {
      existingUser.activeDays += 1;
    }
    
    // Check for new badges
    this.updateBadges(existingUser);
    
    // Tambah activity log
    this.recordActivity(userId, 'login');
    
    return existingUser;
  }

  recordActivity(userId, action) {
    this.data.activities.push({
      userId,
      action,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 1000 activities
    if (this.data.activities.length > 1000) {
      this.data.activities = this.data.activities.slice(-1000);
    }
  }

  updateBadges(user) {
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
    
    user.badges = badges;
  }

  calculateScore(user) {
    const usageScore = user.totalUsage * 0.5;
    const activityScore = user.activeDays * 10;
    const recencyScore = user.lastActive ? 
      Math.max(0, 100 - (Date.now() - new Date(user.lastActive).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    return usageScore + activityScore + recencyScore;
  }

  getLeaderboard(limit = 50) {
    // Update ranking logic
    const leaderboard = this.data.users
      .map(user => ({
        ...user,
        score: this.calculateScore(user)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }));

    // Simpan leaderboard
    this.data.leaderboard = leaderboard;
    
    // Auto reset setiap 30 hari
    const lastReset = new Date(this.data.lastReset);
    const now = new Date();
    const daysSinceReset = (now - lastReset) / (1000 * 60 * 60 * 24);
    
    if (daysSinceReset >= 30) {
      this.resetLeaderboard();
    }
    
    return leaderboard;
  }

  resetLeaderboard() {
    this.data.lastReset = new Date().toISOString();
    this.data.users = this.data.users.map(user => ({
      ...user,
      totalUsage: 0,
      activeDays: 0,
      rank: 0
    }));
  }

  getStats() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const activeToday = this.data.users.filter(user => {
      const userDate = new Date(user.lastActive).toISOString().split('T')[0];
      return userDate === today;
    }).length;

    const totalUsers = this.data.users.length;
    const totalUsage = this.data.users.reduce((sum, user) => sum + user.totalUsage, 0);
    
    // Hitung hari hingga reset
    const lastReset = new Date(this.data.lastReset);
    const nextReset = new Date(lastReset);
    nextReset.setDate(nextReset.getDate() + 30);
    const daysUntilReset = Math.ceil((nextReset - now) / (1000 * 60 * 60 * 24));

    return {
      totalUsers,
      activeToday,
      totalUsage,
      daysUntilReset,
      lastReset: this.data.lastReset,
      nextReset: nextReset.toISOString()
    };
  }
}

// Export singleton instance
export const db = UpsenDatabase.getInstance();