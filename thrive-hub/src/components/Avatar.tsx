const colors = ['bg-brand-500','bg-blue-500','bg-purple-500','bg-orange-500','bg-pink-500','bg-cyan-500','bg-indigo-500','bg-red-500'];
function colorFor(i: string) { const c = i.charCodeAt(0)+(i.charCodeAt(1)||0); return colors[c%colors.length]; }
export default function Avatar({ initials, size='md' }: { initials: string; size?: 'sm'|'md'|'lg' }) {
  const s = size==='sm'?'w-7 h-7 text-xs':size==='lg'?'w-11 h-11 text-base':'w-9 h-9 text-sm';
  return <div className={`${s} ${colorFor(initials)} rounded-full flex items-center justify-center flex-shrink-0`}><span className="text-white font-semibold">{initials}</span></div>;
}
