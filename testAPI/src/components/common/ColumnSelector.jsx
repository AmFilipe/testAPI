import React from 'react';

const ColumnSelector = ({ allColumns, selectedColumns, onColumnToggle }) => {
  return (
    <div className="column-selector">
      <p>Selecione as colunas que deseja exibir:</p>
      <div id="columnCheckboxes">
        {allColumns.map(column => (
          <label key={column}>
            <input
              type="checkbox"
              value={column}
              checked={selectedColumns.includes(column)}
              onChange={() => onColumnToggle(column)}
            />
            {column.charAt(0).toUpperCase() + column.slice(1)}
          </label>
        ))}
      </div>
    </div>
  );
};

export default ColumnSelector;