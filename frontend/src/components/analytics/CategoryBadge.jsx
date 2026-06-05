// src/components/analytics/CategoryBadge.jsx
const categoryColors = {
  'Suv muammosi': 'bg-blue-100 text-blue-700',
  'Elektr': 'bg-yellow-100 text-yellow-700',
  'Gaz': 'bg-orange-100 text-orange-700',
  'Internet': 'bg-purple-100 text-purple-700',
  'Yo‘l muammosi': 'bg-gray-100 text-gray-700',
  'Umumiy': 'bg-green-100 text-green-700'
};

export default function CategoryBadge({ category }) {
  const color = categoryColors[category] || categoryColors['Umumiy'];
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
      {category}
    </span>
  );
}