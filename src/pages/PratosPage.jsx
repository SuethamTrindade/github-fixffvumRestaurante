import { useEffect, useState } from 'react';
import { Row, Col, Input, Select, Button, message } from 'antd';
import { SearchOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons';
import PratoForm from '../components/PratoForm';
import PratoTable from '../components/PratoTable';
import { PratoLocalDAO } from '../daos/pratoLocalDAO';

const dao = new PratoLocalDAO();

export default function PratosPage() {
  const [pratos, setPratos] = useState([]);
  const [filteredPratos, setFilteredPratos] = useState([]);
  const [editing, setEditing] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    const list = dao.list();
    setPratos(list);
    setFilteredPratos(list);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const lower = searchText.toLowerCase();
    const filtrados = pratos.filter(p => 
      p.nome.toLowerCase().includes(lower) || 
      p.categoria.toLowerCase().includes(lower)
    );
    setFilteredPratos(filtrados);
  }, [searchText, pratos]);

  const save = () => { 
    setEditing(null); 
    setShowForm(false); 
    load(); 
  };
  
  const remove = (id) => { 
    dao.remove(id); 
    message.success('Prato removido'); 
    load(); 
  };

  const handleEdit = (record) => {
    setEditing(record);
    setShowForm(true);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* CABEÇALHO */}
      <div className="page-header-wrapper" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        marginBottom: '40px' 
      }}>
        <div>
          <h1 className="page-title">Pratos</h1>
          <p className="page-subtitle">Gerencie o cardápio completo do seu restaurante</p>
        </div>
        
        <Button 
          type="primary" 
          size="large" 
          icon={<PlusOutlined />} 
          onClick={() => { setEditing(null); setShowForm(!showForm); }}
        >
          {showForm ? 'Cancelar' : 'Novo Prato'}
        </Button>
      </div>

      {/* BARRA DE FERRAMENTAS */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '16px', 
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={10}>
            <Input 
              placeholder="Buscar por nome ou ingrediente..." 
              prefix={<SearchOutlined style={{ color: '#9CA3AF', fontSize: '16px' }} />} 
              onChange={e => setSearchText(e.target.value)}
              size="large"
              style={{ border: '1px solid #F3F4F6', backgroundColor: '#F9FAFB' }}
            />
          </Col>
          <Col xs={24} md={6}>
            <Select 
              defaultValue="all" 
              style={{ width: '100%', height: '40px' }} 
              size="large"
              suffixIcon={<FilterOutlined style={{ color: '#9CA3AF' }} />}
              options={[
                { value: 'all', label: 'Todas as categorias' },
                { value: 'Principal', label: 'Principais' },
                { value: 'Entrada', label: 'Entradas' },
                { value: 'Sobremesa', label: 'Sobremesas' },
              ]}
            />
          </Col>
        </Row>
      </div>

      {/* FORMULÁRIO */}
      {showForm && (
        <div style={{ 
          background: 'white', 
          padding: '32px', 
          borderRadius: '16px', 
          marginBottom: '24px',
          border: '1px solid #F3F4F6',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: '700' }}>
            {editing ? 'Editar Prato' : 'Cadastrar Novo Prato'}
          </h3>
          <PratoForm dao={dao} initialValues={editing} onSaved={save} />
        </div>
      )}

      {/* TABELA */}
      <PratoTable data={filteredPratos} onEdit={handleEdit} onDelete={remove} />
    </div>
  );
}