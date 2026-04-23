module.exports = {
  ROLES: {
    VOLUNTEER: 'volunteer',
    ORGANIZATION: 'organization',
    ADMIN: 'admin'
  },

  MISSION_STATUS: {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ONGOING: 'ongoing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },

  APPLICATION_STATUS: {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed'
  },

  MISSION_CATEGORIES: [
    'Education',
    'Health',
    'Environment',
    'Social',
    'Culture',
    'Sport',
    'Animals',
    'Emergency',
    'Other'
  ],

  BADGES: [
    { name: 'Beginner', hours: 10, icon: '🌱' },
    { name: 'Active', hours: 50, icon: '⭐' },
    { name: 'Dedicated', hours: 100, icon: '🏆' },
    { name: 'Champion', hours: 250, icon: '👑' },
    { name: 'Legend', hours: 500, icon: '💎' }
  ]
};
