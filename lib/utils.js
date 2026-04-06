export function calculatePriority(urgency, affectedCount) {
  const urgencyScores = {
    'Low': 1,
    'Medium': 2,
    'High': 3,
    'Critical': 4
  };
  
  const urgencyWeight = urgencyScores[urgency] || 1;
  // Base score from urgency (up to 80)
  const baseScore = urgencyWeight * 20; 
  // Impact score from affected people (up to 20, where 500+ people = 20)
  const impactScore = Math.min((affectedCount / 500) * 20, 20);
  
  // Total priority score (max 100)
  return Math.round(baseScore + impactScore);
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}
