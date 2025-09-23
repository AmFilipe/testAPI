import React, { useState, useEffect } from 'react';
import { fetchData } from '../../services/api';
import DriversTable from './DriversTable';
import ColumnSelector from '../../components/common/ColumnSelector';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allColumns, setAllColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]); // ALTERAÇÃO AQUI: Começa como array vazio

  useEffect(() => {
    const getDrivers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchData('drivers');
        setDrivers(data);
        if (data.length > 0) {
          const columns = Object.keys(data[0]);
          setAllColumns(columns);
          // Não seleciona nada por padrão
          setSelectedColumns([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getDrivers();
  }, []);

  const handleColumnToggle = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(col => col !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  if (loading) return <p>A carregar condutores...</p>;
  if (error) return <p className="error-message">Erro: {error}</p>;

  return (
    <>
      <ColumnSelector 
        allColumns={allColumns} 
        selectedColumns={selectedColumns} 
        onColumnToggle={handleColumnToggle}
      />
      <DriversTable data={drivers} columns={selectedColumns} />
    </>
  );
};

export default Drivers;