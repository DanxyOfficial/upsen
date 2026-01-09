import { Award, Star, Target, Zap, Crown, Flame } from 'lucide-react';
import { useState } from 'react';

const badges = [
  {
    id: 'newbie',
    name: 'Newbie',
    description: 'New user just joined',
    icon: '👶',
    color: 'from-blue-400 to-cyan-400',
    requirement: 'Join the platform'
  },
  {
    id: 'heavy_user',
    name: 'Heavy User',
    description: 'Used tools 100+ times',
    icon: '🏋️',
    color: 'from-orange-500 to-red-500',
    requirement: '100 tool uses'
  },
  {
    id: 'power_user',
    name: 'Power User',
    description: 'Used tools 1000+ times',
    icon: '⚡',
    color: 'from-purple-500 to-pink-500',
    requirement: '1000 tool uses'
  },
  {
    id: 'weekly_hero',
    name: 'Weekly Hero',
    description: 'Active for 7 consecutive days',
    icon: '🌟',
    color: 'from-yellow-500 to-amber-500',
    requirement: '7 active days'
  },
  {
    id: 'monthly_warrior',
    name: 'Monthly Warrior',
    description: 'Active for 30 consecutive days',
    icon: '🗓️',
    color: 'from-emerald-500 to-green-500',
    requirement: '30 active days'
  },
  {
    id: 'top_10',
    name: 'Top 10',
    description: 'Ranked in top 10 users',
    icon: '🏆',
    color: 'from-amber-500 to-orange-500',
    requirement: 'Top 10 rank'
  },
  {
    id: 'champion',
    name: 'Champion',
    description: 'Ranked #1 on leaderboard',
    icon: '👑',
    color: 'from-yellow-400 to-yellow-600',
    requirement: '#1 Rank'
  }
];

export default function BadgeSystem() {
  const [selectedBadge, setSelectedBadge] = useState(badges[0]);

  return (
    <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Award className="w-8 h-8 text-cyan-400" />
        <h3 className="text-2xl font-bold">🏆 Badge System</h3>
      </div>
      
      <p className="text-gray-400 mb-6">
        Earn badges by being active and climbing the leaderboard
      </p>

      {/* Badge Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {badges.map((badge) => (
          <button
            key={badge.id}
            onClick={() => setSelectedBadge(badge)}
            className={`p-3 rounded-xl transition-all transform hover:scale-110 ${
              selectedBadge.id === badge.id 
                ? 'ring-2 ring-cyan-500 bg-gray-800' 
                : 'bg-gray-800/50 hover:bg-gray-800'
            }`}
          >
            <div className={`text-2xl mb-2 ${selectedBadge.id === badge.id ? 'scale-125' : ''}`}>
              {badge.icon}
            </div>
            <p className="text-xs font-semibold truncate">{badge.name}</p>
          </button>
        ))}
      </div>

      {/* Selected Badge Details */}
      <div className={`bg-gradient-to-br ${selectedBadge.color} rounded-xl p-5`}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-4xl">{selectedBadge.icon}</div>
          <div className="text-right">
            <h4 className="text-xl font-bold text-white">{selectedBadge.name}</h4>
            <p className="text-sm text-white/80">{selectedBadge.description}</p>
          </div>
        </div>
        
        <div className="bg-black/30 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold">Requirement:</span>
            <span className="text-sm">{selectedBadge.requirement}</span>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Total Badges Available</span>
          <span className="font-bold text-cyan-400">{badges.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Rarest Badge</span>
          <span className="font-bold text-yellow-400">👑 Champion</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Easiest to Get</span>
          <span className="font-bold text-green-400">👶 Newbie</span>
        </div>
      </div>
    </div>
  );
}