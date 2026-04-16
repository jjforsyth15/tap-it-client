export type MockFriend = {
  id: string;
  name: string;
  handle?: string;
};

/** Placeholder friends until a social graph API exists */
export const MOCK_FRIENDS: MockFriend[] = [
  { id: 'f1', name: 'Jordan Lee', handle: '@jordan' },
  { id: 'f2', name: 'Sam Rivera', handle: '@samr' },
  { id: 'f3', name: 'Priya Shah', handle: '@priya' },
  { id: 'f4', name: 'Chris Ortiz' },
];
