import { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Card, Typography, message, Popconfirm } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const URL_CATEGORY = "/api/book-category";

export default function CategoryScreen() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [loading, setLoading] = useState(false);

  // ดึงข้อมูลหมวดหมู่
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(URL_CATEGORY);
      setCategories(res.data);
    } catch (err) {
      message.error("ไม่สามารถดึงข้อมูลหมวดหมู่ได้");
    } finally {
      setLoading(false);
    }
  };

  // เพิ่มหมวดหมู่ใหม่
  const handleAdd = async () => {
    if (!newCat.trim()) return message.warning("กรุณากรอกชื่อหมวดหมู่");
    try {
      await axios.post(URL_CATEGORY, { name: newCat });
      setNewCat('');
      fetchCategories();
      message.success('เพิ่มหมวดหมู่เรียบร้อยแล้ว');
    } catch (err) {
      message.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
    }
  };

  // ลบหมวดหมู่
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${URL_CATEGORY}/${id}`);
      fetchCategories();
      message.success('ลบหมวดหมู่เรียบร้อยแล้ว');
    } catch (err) {
      message.error("ไม่สามารถลบได้ (อาจมีหนังสือที่ใช้หมวดหมู่นี้อยู่)");
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: '10%' },
    { title: 'Category Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Action',
      key: 'action',
      width: '20%',
      render: (record) => (
        <Popconfirm title="คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่นี้?" onConfirm={() => handleDelete(record.id)} okText="ใช่" cancelText="ไม่">
          <Button type="link" danger icon={<DeleteOutlined />}>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: '30px' }}>
      <Card>
        <Title level={2}>Category Management</Title>
        <Space style={{ marginBottom: 20 }}>
          <Input 
            placeholder="Enter new category name" 
            value={newCat} 
            onChange={(e) => setNewCat(e.target.value)} 
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Category
          </Button>
        </Space>
        
        <Table 
          dataSource={categories} 
          columns={columns} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
}