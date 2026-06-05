// src/components/analytics/StatusBadge.jsx
const statusConfig = {
  new: { label: 'Yangi', color: 'bg-red-500' },
  in_progress: { label: 'Jarayonda', color: 'bg-yellow-500' },
  resolved: { label: 'Hal qilindi', color: 'bg-green-500' },
  cancelled: { label: 'Bekor qilindi', color: 'bg-gray-400' }
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.new;
  return (
    <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}