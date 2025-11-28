import { Form, Select, InputNumber, Button, Card, Space, message, Row, Col } from 'antd'; // Adicionado Row e Col
import { useState, useEffect } from 'react';

export default function PedidoForm({ pedidoDAO, clienteDAO, pratoDAO, onSaved }) {
  const [clientes, setClientes] = useState([]);
  const [pratos, setPratos] = useState([]);
  const [itens, setItens] = useState([]);

  useEffect(() => {
    (async () => {
      setClientes(await clienteDAO.list());
      setPratos(await pratoDAO.list());
    })();
  }, []);

  const addItem = () =>
    setItens([...itens, { pratoId: null, quantidade: 1, precoUnitario: 0 }]);

  const updateItem = (idx, patch) => {
    const next = [...itens];
    next[idx] = { ...next[idx], ...patch };
    if (patch.pratoId) {
      const p = pratos.find((x) => x.id === patch.pratoId);
      next[idx].precoUnitario = p?.preco || 0;
    }
    setItens(next);
  };

  const removeItem = (idx) => setItens(itens.filter((_, i) => i !== idx));

  const total = itens.reduce(
    (acc, i) => acc + i.quantidade * i.precoUnitario,
    0
  );

  const save = async (values) => {
    const payload = {
      clienteId: values.clienteId,
      itens: itens.filter((i) => i.pratoId),
      data: new Date().toISOString(),
      valorTotal: total,
    };
    if (payload.itens.length === 0)
      return message.error('Adicione ao menos 1 item');
    await pedidoDAO.create(payload);
    message.success('Pedido registrado');
    onSaved?.();
  };

  return (
    <Form layout="vertical" onFinish={save}>
      <Form.Item
        name="clienteId"
        label="Cliente"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Selecione o cliente"
          options={clientes.map((c) => ({ value: c.id, label: c.nome }))}
        />
      </Form.Item>

      <Space direction="vertical" style={{ width: '100%' }}>
        {itens.map((item, idx) => {
          const pratoSelecionado = pratos.find((p) => p.id === item.pratoId);
          return (
            <Card
              key={idx}
              size="small"
              title={`Item ${idx + 1}`}
              extra={
                <Button danger size="small" onClick={() => removeItem(idx)}>
                  Remover
                </Button>
              }
            >
              {/* Grid Responsivo */}
              <Row gutter={[16, 16]} align="middle">
                {/* Seleção de Prato: Ocupa 100% no celular (xs=24) e ~45% no PC (md=11) */}
                <Col xs={24} md={11}>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Selecione o prato"
                    value={item.pratoId}
                    onChange={(val) => updateItem(idx, { pratoId: val })}
                    options={pratos.map((p) => ({
                      value: p.id,
                      label: `${p.nome} (R$ ${p.preco})`,
                    }))}
                  />
                </Col>

                {/* Quantidade: Divide linha com Preço no PC */}
                <Col xs={12} md={5}>
                  <InputNumber
                    min={1}
                    style={{ width: '100%' }}
                    placeholder="Qtd"
                    value={item.quantidade}
                    onChange={(q) => updateItem(idx, { quantidade: q })}
                  />
                </Col>

                {/* Preço Unitário */}
                <Col xs={12} md={8} style={{ textAlign: 'right' }}>
                  <strong>R$ {item.precoUnitario.toFixed(2)}</strong>
                </Col>

                {/* Ingredientes (Linha inteira) */}
                {pratoSelecionado && (
                  <Col span={24}>
                    <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#666' }}>
                      Ingredientes: {pratoSelecionado.ingredientes.join(', ')}
                    </div>
                  </Col>
                )}
              </Row>
            </Card>
          );
        })}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button onClick={addItem}>+ Adicionar item</Button>
          <h3 style={{ margin: 0 }}>Total: R$ {total.toFixed(2)}</h3>
        </div>
      </Space>

      <Button type="primary" htmlType="submit" block style={{ marginTop: 24 }}>
        Salvar Pedido
      </Button>
    </Form>
  );
}