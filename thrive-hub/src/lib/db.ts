import { collection, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import type { CollectionReference } from 'firebase/firestore';
import { db } from './firebase';
import type { Member, Booking, StaffMember, Service } from '../types';

type W<T> = Omit<T, 'id'>;

const membersCol = collection(db, 'members') as CollectionReference<W<Member>>;
const bookingsCol = collection(db, 'bookings') as CollectionReference<W<Booking>>;
const staffCol = collection(db, 'staff') as CollectionReference<W<StaffMember>>;
const servicesCol = collection(db, 'services') as CollectionReference<W<Service>>;

export const addMember = (data: W<Member>) => addDoc(membersCol, data);
export const addBooking = (data: W<Booking>) => addDoc(bookingsCol, data);
export const addStaffMember = (data: W<StaffMember>) => addDoc(staffCol, data);
export const addService = (data: W<Service>) => addDoc(servicesCol, data);

export const removeMember = (id: string) => deleteDoc(doc(db, 'members', id));
export const removeBooking = (id: string) => deleteDoc(doc(db, 'bookings', id));
export const removeStaffMember = (id: string) => deleteDoc(doc(db, 'staff', id));
export const removeService = (id: string) => deleteDoc(doc(db, 'services', id));

export const updateBookingStatus = (id: string, status: Booking['status']) =>
  updateDoc(doc(db, 'bookings', id), { status });
