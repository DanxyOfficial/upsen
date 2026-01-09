import { User, Zap, Calendar, Trophy } from 'lucide-react';

export default function UserCard({ user, index }) {
  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return 'bg-gradient-to-br from-yellow-500/20 via-yellow-600/10 to-amber-700/5';
      case 2: return 'bg-gradient-to-br from-gray-400/20 via-gray-500/10 to-gray-600/5';
      case 3: return 'bg-gradient-to-br from-amber-700/20 via-amber-800/10 to-amber-900/5';
      default: return 'bg-gradient-to-br from-gray-800/40 via-gray-900/20 to-black/10';
    }
  };

  const getBadgeIcon = (badge) => {
    switch(badge) {
      case 'champion': return '👑';
      case 'power_user': return '⚡';
      case 'heavy_user': return '🏋️';
      case 'top_10': return '🏆';
      case 'monthly_warrior': return '🗓️';
      case 'weekly_hero': return '🌟';
      default: return '🎖️';
    }
  };

  return (
    <div className={`relative rounded-xl p-5 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${getRankColor(user.rank)}`}>
      {/* Rank Badge */}
      <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-white">
        #{user.rank}
      </div>
      
      {/* User Info */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-700 to-blue-700 flex items-center justify-center">
          <User className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg truncate" title={user.userId}>
            {user.userId}
          </h3>
          <p className="text-sm text-gray-400">
            Joined {new Date(user.joinDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <div>
            <p className="text-xs text-gray-400">Usage</p>
            <p className="font-semibold">{user.totalUsage}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-green-500" />
          <div>
            <p className="text-xs text-gray-400">Active Days</p>
            <p className="font-semibold">{user.activeDays}</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      {user.badges && user.badges.length > 0 && (
        <div className="pt-4 border-t border-gray-700/50">
          <div className="flex items-center space-x-2 mb-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <p className="text-sm font-semibold">Achievements</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.badges.slice(0, 3).map((badge, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 text-xs bg-gradient-to-r from-cyan-800/30 to-blue-800/30 rounded-full flex items-center space-x-1"
                title={badge.replace('_', ' ')}
              >
                <span>{getBadgeIcon(badge)}</span>
                <span className="capitalize">{badge.split('_')[0]}</span>
              </span>
            ))}
            {user.badges.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-800/50 rounded-full">
                +{user.badges.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Last Active */}
      <div className="mt-4 pt-3 border-t border-gray-700/30">
        <p className="text-xs text-gray-400">
          Last active: {new Date(user.lastActive).toLocaleString()}
        </p>
      </div>
    </div>
  );
}