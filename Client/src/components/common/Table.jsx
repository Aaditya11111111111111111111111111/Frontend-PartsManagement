import React from 'react';

const Table = ({ 
  columns, 
  data, 
  loading = false, 
  error = null,
  emptyMessage = 'No data available',
  className = '' 
}) => {
  if (loading) {
    return (
      <div className="table-loading">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-error">
        <div className="text-red-600 text-center py-4">
          {error}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <div className="text-gray-500 text-center py-8">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="table-row">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={column.className}>
                  {column.render ? column.render(row[column.accessor], row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
