import { Button, Form, Select, Input, InputNumber } from 'antd';

export default function AddBook(props) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // ส่งค่ากลับไปให้ BookScreen
    props.onBookAdded(values);
    form.resetFields();
  };

  return (
    <Form form={form} layout="inline" onFinish={onFinish}>
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input placeholder="Book Title" />
      </Form.Item>

      <Form.Item name="author" label="Author" rules={[{ required: true }]}>
        <Input placeholder="Author Name" />
      </Form.Item>

      <Form.Item name="price" label="Price" rules={[{ required: true }]}>
        <InputNumber min={0} placeholder="Price" />
      </Form.Item>

      {/* Dropdown เลือก Category รับค่าจาก props */}
      <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
        <Select 
            style={{ width: 120 }} 
            options={props.categories} 
            placeholder="Select"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Book
        </Button>
      </Form.Item>
    </Form>
  );
}