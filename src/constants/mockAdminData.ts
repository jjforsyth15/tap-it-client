export type AdminOrder = {
  id: string;
  customer: string;
  email: string;
  items: string;
  placedAt: string;
  total: string;
  status: 'awaiting_fulfillment' | 'ready_to_ship' | 'shipped';
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: string;
  lastOrder: string;
};

export const mockOrdersToFulfill: AdminOrder[] = [
  {
    id: 'ORD-1042',
    customer: 'Alex Rivera',
    email: 'alex.r@email.com',
    items: 'TapIt Card ×2, NFC stand',
    placedAt: 'Apr 5, 2:14 PM',
    total: '$86.00',
    status: 'awaiting_fulfillment',
  },
  {
    id: 'ORD-1041',
    customer: 'Jordan Kim',
    email: 'jkim@email.com',
    items: 'Custom card design',
    placedAt: 'Apr 5, 11:02 AM',
    total: '$54.00',
    status: 'awaiting_fulfillment',
  },
  {
    id: 'ORD-1038',
    customer: 'Sam Okonkwo',
    email: 'sam.o@email.com',
    items: 'TapIt Card ×5',
    placedAt: 'Apr 4, 4:51 PM',
    total: '$195.00',
    status: 'awaiting_fulfillment',
  },
];

export const mockOrdersToShip: AdminOrder[] = [
  {
    id: 'ORD-1039',
    customer: 'Morgan Lee',
    email: 'm.lee@email.com',
    items: 'TapIt Card ×1',
    placedAt: 'Apr 4, 9:20 AM',
    total: '$42.00',
    status: 'ready_to_ship',
  },
  {
    id: 'ORD-1036',
    customer: 'Casey Nguyen',
    email: 'casey.n@email.com',
    items: 'TapIt Card ×3, gift box',
    placedAt: 'Apr 3, 3:08 PM',
    total: '$128.00',
    status: 'ready_to_ship',
  },
];

export const mockCustomers: AdminCustomer[] = [
  {
    id: 'CUS-201',
    name: 'Alex Rivera',
    email: 'alex.r@email.com',
    orders: 3,
    spent: '$214.00',
    lastOrder: 'Apr 5',
  },
  {
    id: 'CUS-198',
    name: 'Jordan Kim',
    email: 'jkim@email.com',
    orders: 1,
    spent: '$54.00',
    lastOrder: 'Apr 5',
  },
  {
    id: 'CUS-195',
    name: 'Morgan Lee',
    email: 'm.lee@email.com',
    orders: 5,
    spent: '$412.00',
    lastOrder: 'Apr 4',
  },
  {
    id: 'CUS-192',
    name: 'Sam Okonkwo',
    email: 'sam.o@email.com',
    orders: 2,
    spent: '$267.00',
    lastOrder: 'Apr 4',
  },
];

export const mockAnalytics = {
  revenue7d: '$3,842',
  orders7d: 47,
  avgOrder: '$81.70',
  newCustomers: 12,
  fulfillQueue: mockOrdersToFulfill.length,
  shipQueue: mockOrdersToShip.length,
};
