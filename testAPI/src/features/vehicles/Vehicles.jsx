import React, { useState, useEffect } from 'react';
import { fetchData } from '../../services/api';
import VehiclesTable from './VehiclesTable';
import ColumnSelector from '../../components/common/ColumnSelector';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allColumns, setAllColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]); // ALTERAÇÃO AQUI: Começa como array vazio
  
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    const getVehicles = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchData('vehicles');
        setVehicles(data);
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
    getVehicles();
  }, []);

  const handleColumnToggle = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(col => col !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditItem(item);
  };

  const handleSave = () => {
    console.log("Saving data:", editItem);
    setIsEditing(false);
    setEditItem(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditItem(null);
  };

  if (loading) return <p>A carregar veículos...</p>;
  if (error) return <p className="error-message">Erro: {error}</p>;

  if (isEditing) {
    return (
      <div className="edit-form">
        <h3>Editando Veículo</h3>
        {Object.keys(editItem).map(key => (
          <div key={key}>
            <label>{key}:</label>
            <input
              type="text"
              value={String(editItem[key])}
              onChange={(e) => setEditItem({ ...editItem, [key]: e.target.value })}
            />
          </div>
        ))}
        <button onClick={handleSave}>Salvar</button>
        <button onClick={handleCancel}>Cancelar</button>
      </div>
    );
  }

  return (
    <>
      <ColumnSelector 
        allColumns={allColumns} 
        selectedColumns={selectedColumns} 
        onColumnToggle={handleColumnToggle}
      />
      <VehiclesTable data={vehicles} onEdit={handleEdit} columns={selectedColumns} />
    </>
  );
};

export default Vehicles;