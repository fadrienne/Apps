export interface Member {
  id: string;
  name: string;
  email: string;
  plan: 'Basic' | 'Premium' | 'Elite';
  status: 'Active' | 'Inactive' | 'Pending';
  joinDate: string;
  lastVisit: string;
  totalSessions: number;
  avatar: string;
}

export interface Booking {
  id: string;
  memberName: string;
  service: string;
  staff: string;
  date: string;
  time: string;
  duration: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  amount: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  specialization: string;
  rating: number;
  totalClients: number;
  sessionsThisMonth: number;
  revenue: number;
  avatar: string;
  status: 'Available' | 'Busy' | 'Off';
}

export interface Service {
  id: string;
  name: string;
  category: string;
  duration: number;
  price: number;
  totalBookings: number;
  rating: number;
  capacity: number;
  currentEnrolled: number;
}

export interface MetricData {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: string;
  color: string;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface MemberGrowthPoint {
  month: string;
  newMembers: number;
  churned: number;
  total: number;
}

export interface ServiceUsagePoint {
  name: string;
  sessions: number;
  fill: string;
}
