import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  itemsPerPage = 10
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');

  const filteredData = data.filter(row => {
    if (!search) return true;
    return Object.values(row).some(value =>
      String(value).toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Qidirish..."
          className="px-4 py-2 border rounded-lg w-full md:w-80 focus:outline-none focus:border-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-left text-sm font-semibold">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-sm font-semibold">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 text-sm">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    {onView && (
                      <button onClick={() => onView(row)} className="text-blue-500 hover:text-blue-700">
                        <i className="fas fa-eye"></i>
                      </button>
                    )}
                    {onEdit && (
                      <button onClick={() => onEdit(row)} className="text-green-500 hover:text-green-700">
                        <i className="fas fa-edit"></i>
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} className="text-red-500 hover:text-red-700">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">
            {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredData.length)} / {filteredData.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border rounded-lg disabled:opacity-50"
            >
              <FiChevronLeft />
            </button>
            <span className="px-4 py-2 border rounded-lg">{currentPage}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border rounded-lg disabled:opacity-50"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}