import { Trophy, Crown, Star, TrendingUp } from 'lucide-react';

export default function Leaderboard({ data }) {
  const getRankIcon = (rank) => {
    switch(rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Trophy className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-gray-400 font-bold">{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return 'from-yellow-500/20 to-yellow-600/10';
      case 2: return 'from-gray-400/20 to-gray-500/10';
      case 3: return 'from-amber-700/20 to-amber-800/10';
      default: return 'from-gray-800/50 to-gray-900/30';
    }
  };

  return (
    <div className="space-y-3">
      {data.map((user, index) => (
        <div
          key={user.userId}
          className={`p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
            index < 3 ? 'border-opacity-50' : 'border-opacity-20'
          } border-gray-600 bg-gradient-to-r ${getRankColor(user.rank)}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800">
                {getRankIcon(user.rank)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-lg truncate max-w-[150px]">
                    {user.userId}
                  </h3>
                  {user.badges?.includes('champion') && (
                    <span className="px-2 py-1 text-xs bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-full">
                      👑 Champion
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <span>🔥 {user.totalUsage} uses</span>
                  <span>📅 {user.activeDays} days</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center justify-end space-x-2">
                {user.badges?.slice(0, 2).map((badge, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 text-xs bg-gradient-to-r from-cyan-700/30 to-blue-700/30 rounded-full"
                  >
                    {badge}
                  </span>
                ))}
                {user.badges?.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{user.badges.length - 2}
                  </span>
                )}
              </div>
              <div className="mt-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                #{user.rank}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Activity Score</span>
              <span className="font-semibold">{Math.round(user.score || 0)}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (user.score || 0) / 10)}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}