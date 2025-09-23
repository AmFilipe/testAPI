import React from 'react';

const VehiclesTable = ({ data, onEdit, columns }) => {
  if (!data || data.length === 0 || !columns || columns.length === 0) {
    return <p>Nenhum dado para exibir. Selecione pelo menos uma coluna.</p>;
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => {
                let cellContent = String(row[col]);
                if (col === 'Terminals' && Array.isArray(row[col]) && row[col].length > 0) {
                  cellContent = row[col][0].Id;
                } else if (typeof row[col] === 'object' && row[col] !== null) {
                  cellContent = JSON.stringify(row[col]);
                }
                return <td key={colIndex}>{cellContent}</td>;
              })}
              <td>
                <button onClick={() => onEdit(row)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehiclesTable;