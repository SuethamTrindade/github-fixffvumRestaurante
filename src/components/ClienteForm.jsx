import { Form, Input, Button, message } from 'antd';
import { useState } from 'react';

export default function ClienteForm({ dao, initialValues, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = { ...values };
      const res = initialValues?.id
        ? await dao.update(initialValues.id, payload)
        : await dao.create(payload);
      message.success('Cliente salvo com sucesso');
      onSaved?.(res);
      form.resetFields();
    } catch {
      message.error('Erro ao salvar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" initialValues={initialValues} onFinish={onFinish}>
      <Form.Item name="nome" label="Nome" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="telefone" label="Telefone" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      {/* Campo Endereço substituindo CPF */}
      <Form.Item
        name="endereco"
        label="Endereço"
        rules={[{ required: true, message: 'Informe o endereço' }]}
      >
        <Input placeholder="Rua, número, bairro, cidade..." />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading}>
        {initialValues?.id ? 'Atualizar' : 'Cadastrar'}
      </Button>
    </Form>
  );
}
