import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';

export default function EditBook({ isOpen, item, categories, onCancel, onSave }) {
  const [form] = Form.useForm();

 
  useEffect(() => {
    if (isOpen && item) {
      form.setFieldsValue({
        ...item,
        categoryId: item.category?.id 
      });
    }
  }, [isOpen, item, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      
      onSave({ ...item, ...values });
    }).catch((info) => {
      console.log('Validate Failed:',info);
    });
  };

  return (
    <Modal
      title="Edit Book"
      open={isOpen}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Save"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="author" label="Author" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>

        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
          <Select options={categories} />
        </Form.Item>
      </Form>
    </Modal>
  );
}