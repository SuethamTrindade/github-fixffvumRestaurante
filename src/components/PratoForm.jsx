import { Form, Input, InputNumber, Select, Button, message, Row, Col } from 'antd';
import { useState, useEffect } from 'react';

// Lista padrão de ingredientes sugeridos
const INGREDIENTES_PADRAO = [
  "Arroz", "Feijão", "Batata", "Carne bovina", "Frango", "Peixe", "Porco",
  "Ovos", "Queijo", "Presunto", "Tomate", "Cebola", "Alho", "Pimentão",
  "Cenoura", "Ervilha", "Milho", "Alface", "Rúcula", "Espinafre",
  "Molho de tomate", "Molho branco", "Azeite", "Manteiga", "Farinha",
  "Macarrão", "Massa de pizza", "Chocolate", "Açúcar", "Sal", "Pimenta",
  "Orégano", "Manjericão", "Salsa", "Coentro"
];

export default function PratoForm({ dao, initialValues, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Garante que o form atualize se o initialValues mudar
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        nome: values.nome.trim(),
        preco: Number(values.preco),
        categoria: values.categoria,
        ingredientes: values.ingredientes || [],
      };
      const res = initialValues?.id
        ? await dao.update(initialValues.id, payload)
        : await dao.create(payload);
      
      message.success('Prato salvo com sucesso');
      onSaved?.(res);
      
      if (!initialValues?.id) {
        form.resetFields();
      }
    } catch {
      message.error('Erro ao salvar prato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" initialValues={initialValues} onFinish={onFinish}>
      <Form.Item name="nome" label="Nome" rules={[{ required: true }]}>
        <Input placeholder="Ex: Lasanha" />
      </Form.Item>

      {/* Grid Responsivo para Preço e Categoria */}
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="preco" label="Preço" rules={[{ required: true }]}>
            <InputNumber prefix="R$" style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="categoria" label="Categoria" rules={[{ required: true }]}>
            <Select options={[
              { value: 'Entrada', label: 'Entrada' },
              { value: 'Principal', label: 'Principal' },
              { value: 'Sobremesa', label: 'Sobremesa' },
            ]} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="ingredientes" label="Ingredientes">
        <Select
          mode="tags"
          tokenSeparators={[',']}
          placeholder="Digite ou selecione os ingredientes"
          options={INGREDIENTES_PADRAO.map(i => ({ value: i, label: i }))}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" block loading={loading}>
        {initialValues?.id ? 'Atualizar' : 'Cadastrar'}
      </Button>
    </Form>
  );
}