import { useEffect, useState } from 'react';
import { Button, Drawer, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PedidoForm from '../components/PedidoForm';
import PedidoTable from '../components/PedidoTable';
import { PedidoLocalDAO } from '../daos/pedidoLocalDAO';
import { ClienteLocalDAO } from '../daos/clienteLocalDAO';
import { PratoLocalDAO } from '../daos/pratoLocalDAO';

const pedidoDAO = new PedidoLocalDAO();
const clienteDAO = new ClienteLocalDAO();
const pratoDAO = new PratoLocalDAO();

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [clientesById, setClientesById] = useState({});
  const [pratosById, setPratosById] = useState({});
  const [open, setOpen] = useState(false);

  const load = () => {
    const ps = pedidoDAO.list();
    const cs = clienteDAO.list();
    const rs = pratoDAO.list();
    setPedidos(ps);
    setClientesById(Object.fromEntries(cs.map(c => [c.id, c])));
    setPratosById(Object.fromEntries(rs.map(r => [r.id, r])));
  };

  useEffect(() => { load(); }, []);

  const remove = (id) => { pedidoDAO.remove(id); message.success('Pedido excluído'); load(); };

  return (
    <div style={{ width: '100%' }}>
      <div className="page-header-wrapper" style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' 
      }}>
        <div>
          <h1 className="page-title">Pedidos</h1>
          <p className="page-subtitle">Gestão de pedidos em tempo real</p>
        </div>
        <Button 
          type="primary" size="large" icon={<PlusOutlined />} 
          onClick={() => setOpen(true)}
        >
          Novo Pedido
        </Button>
      </div>

      <PedidoTable data={pedidos} clientesById={clientesById} pratosById={pratosById} onDelete={remove} />
      
      <Drawer 
        title={<span style={{ fontSize: '18px', fontWeight: '700' }}>Novo Pedido</span>} 
        open={open} 
        onClose={() => setOpen(false)} 
        width={520}
        styles={{ body: { background: '#F9FAFB' } }}
      >
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <PedidoForm
            pedidoDAO={pedidoDAO}
            clienteDAO={clienteDAO}
            pratoDAO={pratoDAO}
            onSaved={() => { setOpen(false); load(); }}
          />
        </div>
      </Drawer>
    </div>
  );
}