import { Table, Button, Popconfirm } from 'antd';

/**
 * Componente de tabela de pedidos
 * @param {Array} data - Lista de pedidos
 * @param {Object} clientesById - Mapa de clientes (id -> cliente)
 * @param {Object} pratosById - Mapa de pratos (id -> prato)
 * @param {Function} onDelete - Função para excluir pedido
 */
export default function PedidoTable({ data, clientesById, pratosById, onDelete }) {
  const columns = [
    {
      title: 'Data',
      dataIndex: 'data',
      render: (d) => new Date(d).toLocaleString('pt-BR'),
    },
    {
      title: 'Cliente',
      dataIndex: 'clienteId',
      render: (id) => clientesById[id]?.nome || '—',
    },
    {
      title: 'Itens',
      dataIndex: 'itens',
      render: (itens) =>
        itens.map((i) => {
          const prato = pratosById[i.pratoId];
          return (
            <div key={i.pratoId} style={{ marginBottom: 8 }}>
              <strong>{prato?.nome || 'Prato removido'}</strong> x{i.quantidade}
              <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#555' }}>
                Ingredientes: {prato?.ingredientes?.join(', ') || '—'}
              </div>
            </div>
          );
        }),
    },
    {
      title: 'Valor Total',
      dataIndex: 'valorTotal',
      render: (v) => `R$ ${v.toFixed(2)}`,
    },
    {
      title: 'Ações',
      render: (_, record) => (
        <Popconfirm
          title="Excluir pedido?"
          onConfirm={() => onDelete(record.id)}
        >
          <Button danger size="small">Excluir</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table 
      rowKey="id" 
      columns={columns} 
      dataSource={data} 
      pagination={{ pageSize: 5 }}
      // ADICIONE ESTA LINHA:
      scroll={{ x: 'max-content' }} 
    />
  );
}