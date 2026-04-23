type Status = 'Active' | 'Inactive' | 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | 'Available' | 'Busy' | 'Off';

const statusStyles: Record<Status, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-gray-100 text-gray-600',
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Cancelled: 'bg-red-100 text-red-700',
  Completed: 'bg-green-100 text-green-700',
  Available: 'bg-green-100 text-green-700',
  Busy: 'bg-orange-100 text-orange-700',
  Off: 'bg-gray-100 text-gray-600',
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
