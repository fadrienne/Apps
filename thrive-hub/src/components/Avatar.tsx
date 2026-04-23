const colors = [
  'bg-brand-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500',
  'bg-pink-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-red-500',
];

function colorFor(initials: string) {
  const code = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
  return colors[code % colors.length];
}

export default function Avatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-11 h-11 text-base' : 'w-9 h-9 text-sm';
  return (
    <div className={`${sizeClass} ${colorFor(initials)} rounded-full flex items-center justify-center flex-shrink-0`}>
      <span className="text-white font-semibold">{initials}</span>
    </div>
  );
}
