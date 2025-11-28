import { Table, Button, Popconfirm, Tag, Typography } from 'antd';
import { DeleteOutlined, CalendarOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function PedidoTable({ data, clientesById, pratosById, onDelete }) {
  const columns = [
    {
      title: 'DATA',
      dataIndex: 'data',
      render: (d) => (
        <span style={{ color: '#6B7280', fontSize: '13px' }}>
          <CalendarOutlined style={{ marginRight: '6px' }} />
          {new Date(d).toLocaleDateString('pt-BR')}
        </span>
      ),
    },
    {
      title: 'CLIENTE',
      dataIndex: 'clienteId',
      render: (id) => <Text strong>{clientesById[id]?.nome || '—'}</Text>,
    },
    {
      title: 'ITENS',
      dataIndex: 'itens',
      render: (itens) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {itens.map((i) => {
            const prato = pratosById[i.pratoId];
            return (
              <Tag key={i.pratoId} color="default" style={{ border: '1px solid #E5E7EB', background: '#F9FAFB', color: '#374151' }}>
                {i.quantidade}x {prato?.nome || '?'}
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: 'TOTAL',
      dataIndex: 'valorTotal',
      align: 'right',
      render: (v) => <span style={{ color: '#F28A2E', fontWeight: '700' }}>R$ {v.toFixed(2)}</span>,
    },
    {
      title: '',
      align: 'right',
      render: (_, record) => (
        <Popconfirm title="Excluir?" onConfirm={() => onDelete(record.id)}>
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
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