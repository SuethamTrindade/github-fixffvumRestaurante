import { useEffect, useState } from 'react';
import { Table, Select, DatePicker, Statistic, Row, Col, Card } from 'antd';
import { ShoppingCartOutlined, DollarCircleOutlined, RiseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { PedidoLocalDAO } from '../daos/pedidoLocalDAO.js';
import { ClienteLocalDAO } from '../daos/clienteLocalDAO.js';

const pedidoDAO = new PedidoLocalDAO();
const clienteDAO = new ClienteLocalDAO();

export default function RelatorioPedidosPorCliente() {
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [clienteId, setClienteId] = useState(null);
  const [range, setRange] = useState([null, null]);

  const load = () => {
    setPedidos(pedidoDAO.list());
    setClientes(clienteDAO.list());
  };

  useEffect(() => { load(); }, []);

  const filtered = pedidos.filter(p => {
    const byCliente = clienteId ? p.clienteId === clienteId : true;
    const d = dayjs(p.data);
    const byDate = range[0] && range[1] ? d.isAfter(range[0]) && d.isBefore(range[1]) : true;
    return byCliente && byDate;
  });

  const totalPedidos = filtered.length;
  const totalValor = filtered.reduce((acc, p) => acc + p.valorTotal, 0);

  const columns = [
    { title: 'DATA', dataIndex: 'data', render: (d) => new Date(d).toLocaleDateString('pt-BR') },
    { title: 'QTD ITENS', dataIndex: 'itens', render: (itens) => itens.reduce((a, i) => a + i.quantidade, 0) },
    { title: 'VALOR', dataIndex: 'valorTotal', render: (v) => <b style={{ color: '#F28A2E' }}>R$ {v.toFixed(2)}</b> },
  ];

  const StatCard = ({ title, value, icon, color }) => (
    <Card bordered={false} bodyStyle={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ 
          background: color + '15', 
          width: '48px', height: '48px', 
          borderRadius: '12px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: color, fontSize: '20px'
        }}>
          {icon}
        </div>
        <div>
          <p style={{ margin: 0, color: '#9CA3AF', fontSize: '13px', fontWeight: '500' }}>{title}</p>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1F2937' }}>{value}</h3>
        </div>
      </div>
    </Card>
  );

  return (
    <div style={{ maxWidth: '100%' }}>
      <div className="page-header-wrapper" style={{ marginBottom: '40px' }}>
        <h1 className="page-title">Relatório</h1>
        <p className="page-subtitle">Métricas e desempenho de vendas</p>
      </div>
      
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={24} md={12} lg={8}>
          <StatCard title="Total de Pedidos" value={totalPedidos} icon={<ShoppingCartOutlined />} color="#3B82F6" />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <StatCard title="Faturamento" value={`R$ ${totalValor.toFixed(2)}`} icon={<DollarCircleOutlined />} color="#10B981" />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <StatCard title="Ticket Médio" value={`R$ ${(totalPedidos ? (totalValor / totalPedidos) : 0).toFixed(2)}`} icon={<RiseOutlined />} color="#F59E0B" />
        </Col>
      </Row>

      <div style={{ background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
         <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Select
              allowClear
              placeholder="Filtrar por cliente"
              options={clientes.map(c => ({ value: c.id, label: c.nome }))}
              onChange={setClienteId}
              style={{ width: '100%', height: '40px' }}
            />
          </Col>
          <Col xs={24} md={16}>
            <DatePicker.RangePicker style={{ width: '100%', height: '40px' }} onChange={(vals) => setRange(vals)} />
          </Col>
         </Row>
      </div>

      <div className="clean-table" style={{ background: 'white', borderRadius: '16px', padding: '8px' }}>
        <Table 
          rowKey="id" 
          columns={columns} 
          dataSource={filtered} 
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
}