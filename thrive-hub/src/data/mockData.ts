import type { Member, Booking, StaffMember, Service, RevenuePoint, MemberGrowthPoint, ServiceUsagePoint } from '../types';

export const members: Member[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.j@email.com', plan: 'Elite', status: 'Active', joinDate: '2024-01-15', lastVisit: '2026-04-22', totalSessions: 142, avatar: 'SJ' },
  { id: '2', name: 'Marcus Lee', email: 'marcus.l@email.com', plan: 'Premium', status: 'Active', joinDate: '2024-03-08', lastVisit: '2026-04-20', totalSessions: 89, avatar: 'ML' },
  { id: '3', name: 'Priya Nair', email: 'priya.n@email.com', plan: 'Basic', status: 'Active', joinDate: '2025-01-22', lastVisit: '2026-04-18', totalSessions: 34, avatar: 'PN' },
  { id: '4', name: 'Tom Walker', email: 'tom.w@email.com', plan: 'Premium', status: 'Inactive', joinDate: '2024-06-10', lastVisit: '2026-03-01', totalSessions: 56, avatar: 'TW' },
  { id: '5', name: 'Aisha Kamara', email: 'aisha.k@email.com', plan: 'Elite', status: 'Active', joinDate: '2023-11-05', lastVisit: '2026-04-23', totalSessions: 210, avatar: 'AK' },
  { id: '6', name: 'Liam Chen', email: 'liam.c@email.com', plan: 'Basic', status: 'Pending', joinDate: '2026-04-20', lastVisit: '—', totalSessions: 0, avatar: 'LC' },
  { id: '7', name: 'Emma Davis', email: 'emma.d@email.com', plan: 'Premium', status: 'Active', joinDate: '2025-06-14', lastVisit: '2026-04-21', totalSessions: 67, avatar: 'ED' },
  { id: '8', name: 'Noah Patel', email: 'noah.p@email.com', plan: 'Elite', status: 'Active', joinDate: '2024-09-30', lastVisit: '2026-04-23', totalSessions: 118, avatar: 'NP' },
];

export const bookings: Booking[] = [
  { id: 'B001', memberName: 'Sarah Johnson', service: 'Personal Training', staff: 'Jake Rivers', date: '2026-04-23', time: '09:00', duration: 60, status: 'Confirmed', amount: 85 },
  { id: 'B002', memberName: 'Aisha Kamara', service: 'Yoga Flow', staff: 'Maya Bloom', date: '2026-04-23', time: '10:30', duration: 60, status: 'Confirmed', amount: 45 },
  { id: 'B003', memberName: 'Marcus Lee', service: 'Nutrition Coaching', staff: 'Dr. Sam Cole', date: '2026-04-23', time: '11:00', duration: 45, status: 'Confirmed', amount: 120 },
  { id: 'B004', memberName: 'Noah Patel', service: 'HIIT Class', staff: 'Jake Rivers', date: '2026-04-23', time: '12:00', duration: 45, status: 'Pending', amount: 40 },
  { id: 'B005', memberName: 'Priya Nair', service: 'Mindfulness Session', staff: 'Maya Bloom', date: '2026-04-23', time: '14:00', duration: 60, status: 'Confirmed', amount: 55 },
  { id: 'B006', memberName: 'Tom Walker', service: 'Personal Training', staff: 'Jake Rivers', date: '2026-04-22', time: '09:00', duration: 60, status: 'Completed', amount: 85 },
  { id: 'B007', memberName: 'Emma Davis', service: 'Pilates', staff: 'Maya Bloom', date: '2026-04-22', time: '11:00', duration: 50, status: 'Completed', amount: 50 },
  { id: 'B008', memberName: 'Liam Chen', service: 'Yoga Flow', staff: 'Maya Bloom', date: '2026-04-24', time: '09:30', duration: 60, status: 'Pending', amount: 45 },
  { id: 'B009', memberName: 'Sarah Johnson', service: 'HIIT Class', staff: 'Jake Rivers', date: '2026-04-21', time: '07:00', duration: 45, status: 'Completed', amount: 40 },
  { id: 'B010', memberName: 'Aisha Kamara', service: 'Personal Training', staff: 'Jake Rivers', date: '2026-04-20', time: '08:00', duration: 60, status: 'Cancelled', amount: 85 },
];

export const staff: StaffMember[] = [
  { id: 'S1', name: 'Jake Rivers', role: 'Senior Trainer', specialization: 'Strength & HIIT', rating: 4.9, totalClients: 38, sessionsThisMonth: 64, revenue: 5440, avatar: 'JR', status: 'Busy' },
  { id: 'S2', name: 'Maya Bloom', role: 'Wellness Coach', specialization: 'Yoga & Mindfulness', rating: 4.8, totalClients: 31, sessionsThisMonth: 52, revenue: 2860, avatar: 'MB', status: 'Available' },
  { id: 'S3', name: 'Dr. Sam Cole', role: 'Nutritionist', specialization: 'Sports Nutrition', rating: 4.7, totalClients: 22, sessionsThisMonth: 36, revenue: 4320, avatar: 'SC', status: 'Available' },
  { id: 'S4', name: 'Rina Torres', role: 'Physiotherapist', specialization: 'Injury Recovery', rating: 4.9, totalClients: 27, sessionsThisMonth: 44, revenue: 6160, avatar: 'RT', status: 'Busy' },
  { id: 'S5', name: 'Caleb Morris', role: 'Pilates Instructor', specialization: 'Core & Flexibility', rating: 4.6, totalClients: 18, sessionsThisMonth: 28, revenue: 1400, avatar: 'CM', status: 'Off' },
];

export const services: Service[] = [
  { id: 'SV1', name: 'Personal Training', category: 'Fitness', duration: 60, price: 85, totalBookings: 312, rating: 4.9, capacity: 1, currentEnrolled: 1 },
  { id: 'SV2', name: 'Yoga Flow', category: 'Wellness', duration: 60, price: 45, totalBookings: 248, rating: 4.8, capacity: 12, currentEnrolled: 9 },
  { id: 'SV3', name: 'HIIT Class', category: 'Fitness', duration: 45, price: 40, totalBookings: 195, rating: 4.7, capacity: 15, currentEnrolled: 12 },
  { id: 'SV4', name: 'Nutrition Coaching', category: 'Health', duration: 45, price: 120, totalBookings: 142, rating: 4.8, capacity: 1, currentEnrolled: 1 },
  { id: 'SV5', name: 'Mindfulness Session', category: 'Wellness', duration: 60, price: 55, totalBookings: 118, rating: 4.7, capacity: 8, currentEnrolled: 5 },
  { id: 'SV6', name: 'Pilates', category: 'Fitness', duration: 50, price: 50, totalBookings: 96, rating: 4.6, capacity: 10, currentEnrolled: 6 },
  { id: 'SV7', name: 'Physiotherapy', category: 'Health', duration: 60, price: 140, totalBookings: 88, rating: 4.9, capacity: 1, currentEnrolled: 1 },
];

export const revenueData: RevenuePoint[] = [
  { month: 'Oct', revenue: 28400, expenses: 12000, profit: 16400 },
  { month: 'Nov', revenue: 31200, expenses: 13500, profit: 17700 },
  { month: 'Dec', revenue: 35800, expenses: 15000, profit: 20800 },
  { month: 'Jan', revenue: 29600, expenses: 12800, profit: 16800 },
  { month: 'Feb', revenue: 33100, expenses: 13200, profit: 19900 },
  { month: 'Mar', revenue: 38400, expenses: 14600, profit: 23800 },
  { month: 'Apr', revenue: 41200, expenses: 15200, profit: 26000 },
];

export const memberGrowthData: MemberGrowthPoint[] = [
  { month: 'Oct', newMembers: 18, churned: 4, total: 186 },
  { month: 'Nov', newMembers: 22, churned: 5, total: 203 },
  { month: 'Dec', newMembers: 15, churned: 7, total: 211 },
  { month: 'Jan', newMembers: 28, churned: 3, total: 236 },
  { month: 'Feb', newMembers: 31, churned: 4, total: 263 },
  { month: 'Mar', newMembers: 26, churned: 6, total: 283 },
  { month: 'Apr', newMembers: 34, churned: 2, total: 315 },
];

export const serviceUsageData: ServiceUsagePoint[] = [
  { name: 'Personal Training', sessions: 312, fill: '#22c55e' },
  { name: 'Yoga Flow', sessions: 248, fill: '#3b82f6' },
  { name: 'HIIT Class', sessions: 195, fill: '#f59e0b' },
  { name: 'Nutrition Coaching', sessions: 142, fill: '#8b5cf6' },
  { name: 'Mindfulness', sessions: 118, fill: '#ec4899' },
  { name: 'Pilates', sessions: 96, fill: '#06b6d4' },
  { name: 'Physiotherapy', sessions: 88, fill: '#ef4444' },
];
