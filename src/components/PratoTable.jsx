import { Table, Button, Popconfirm, Tag, Avatar, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, FireOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function PratoTable({ data, onEdit, onDelete }) {
  
  const getCategoryColor = (category) => {
    switch(category) {
      case 'Principal': return 'volcano';
      case 'Entrada': return 'green';
      case 'Sobremesa': return 'purple';
      default: return 'blue';
    }
  };

  const columns = [
    { 
      title: 'PRATO', 
      dataIndex: 'nome',
      render: (text) => (
        <div style={{ display: 'flex', items: 'center', gap: '12px' }}>
           <Avatar shape="square" icon={<FireOutlined />} style={{ backgroundColor: '#FFF0E6', color: '#F28A2E' }} />
           <Text strong style={{ fontSize: '15px' }}>{text}</Text>
        </div>
      )
    },
    { 
      title: 'CATEGORIA', 
      dataIndex: 'categoria',
      render: (tag) => (
        <Tag color={getCategoryColor(tag)} style={{ borderRadius: '20px', padding: '2px 12px', fontWeight: '600', border: 'none' }}>
          {tag ? tag.toUpperCase() : 'GERAL'}
        </Tag>
      )
    },
    { 
      title: 'PREÇO', 
      dataIndex: 'preco', 
      render: (v) => <span style={{ color: '#F28A2E', fontWeight: '700', fontSize: '15px' }}>R$ {v.toFixed(2)}</span>,
      align: 'right'
    },
    { 
      title: 'INGREDIENTES', 
      dataIndex: 'ingredientes', 
      render: (arr) => <span style={{ color: '#6B7280', fontSize: '13px' }}>{arr.slice(0, 3).join(', ')}{arr.length > 3 ? '...' : ''}</span>,
      responsive: ['md'] // Esconde no mobile se ficar apertado
    },
    {
      title: '',
      align: 'right',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button 
            type="text" 
            icon={<EditOutlined style={{ color: '#9CA3AF' }} />} 
            onClick={() => onEdit(record)} 
          />
          <Popconfirm title="Excluir?" onConfirm={() => onDelete(record.id)}>
            <Button 
              type="text" 
              danger
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </div>
      )
    }
  ];
  
  return (
    <div className="clean-table" style={{ background: 'white', borderRadius: '16px', padding: '8px' }}>
      <Table 
        rowKey="id" 
        columns={columns} 
        dataSource={data} 
        pagination={{ pageSize: 6 }} 
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}