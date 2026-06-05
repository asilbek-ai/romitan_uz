// src/utils/categoryAnalyzer.js
export const analyzeCategory = (text) => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('suv') || lowerText.includes('water') || lowerText.includes('vodoprovod')) {
    return 'Suv muammosi';
  }
  if (lowerText.includes('elektr') || lowerText.includes('electric') || lowerText.includes('light')) {
    return 'Elektr';
  }
  if (lowerText.includes('gaz') || lowerText.includes('gas')) {
    return 'Gaz';
  }
  if (lowerText.includes('internet') || lowerText.includes('wifi') || lowerText.includes('online')) {
    return 'Internet';
  }
  if (lowerText.includes('yo‘l') || lowerText.includes('road') || lowerText.includes('asfalt')) {
    return 'Yo‘l muammosi';
  }
  return 'Umumiy';
};

export const getCategoryColor = (category) => {
  const colors = {
    'Suv muammosi': 'bg-blue-100 text-blue-700',
    'Elektr': 'bg-yellow-100 text-yellow-700',
    'Gaz': 'bg-orange-100 text-orange-700',
    'Internet': 'bg-purple-100 text-purple-700',
    'Yo‘l muammosi': 'bg-gray-100 text-gray-700',
    'Umumiy': 'bg-green-100 text-green-700'
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
};