export const SECURITY_QUESTIONS = [
  { id: 'first-pet', label: 'What was the name of your first pet?' },
  { id: 'birth-city', label: 'What city were you born in?' },
  { id: 'maiden-name', label: "What is your mother's maiden name?" },
  { id: 'first-school', label: 'What was the name of your first school?' },
  { id: 'first-car', label: 'What was your first car model?' },
  { id: 'favorite-teacher', label: 'What was your favorite teacher\'s name?' },
  { id: 'childhood-nickname', label: 'What was your childhood nickname?' },
  { id: 'first-job', label: 'Where did you work at your first job?' },
  { id: 'spouse-name', label: "What is your spouse's first name?" },
  { id: 'sibling-name', label: "What is your oldest sibling's middle name?" },
  { id: 'father-middle', label: "What is your father's middle name?" },
  { id: 'street-grown-up', label: 'What street did you grow up on?' },
  { id: 'favorite-food', label: 'What is your favorite food?' },
  { id: 'best-friend', label: 'What is your best friend\'s first name?' },
  { id: 'first-concert', label: 'What was the first concert you attended?' },
] as const;

export type SecurityQuestionId = (typeof SECURITY_QUESTIONS)[number]['id'];
