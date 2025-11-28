import { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ClienteForm from '../components/ClienteForm';
import ClienteTable from '../components/ClienteTable';
import { ClienteLocalDAO } from '../daos/clienteLocalDAO';

const dao = new ClienteLocalDAO();

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => setClientes(dao.list());

  useEffect(() => { load(); }, []);

  const save = () => { 
    setEditing(null); 
    setShowForm(false);
    load(); 
  };
  const remove = (id) => { dao.remove(id); message.success('Cliente excluído'); load(); };

  return (
    <div style={{ width: '100%' }}>
      <div className="page-header-wrapper" style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' 
      }}>
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">Base de clientes cadastrados</p>
        </div>
        <Button 
          type="primary" size="large" icon={<PlusOutlined />} 
          onClick={() => { setEditing(null); setShowForm(!showForm); }}
        >
          {showForm ? 'Cancelar' : 'Novo Cliente'}
        </Button>
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '32px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: '700' }}>
            {editing ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
          </h3>
          <ClienteForm dao={dao} initialValues={editing} onSaved={save} />
        </div>
      )}

      <ClienteTable data={clientes} onEdit={(r) => { setEditing(r); setShowForm(true); }} onDelete={remove} />
    </div>
  );
}