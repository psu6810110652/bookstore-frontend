// components/Dashboard.jsx
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Card, Row, Col, Statistic } from 'antd';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Dashboard({ books }) {
  // ข้อมูลกราฟวงกลม (Stock)
  const pieData = {
    labels: books.map(b => b.title),
    datasets: [{
      label: 'จำนวนสต็อก',
      data: books.map(b => b.stock),
      backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'],
    }]
  };

  // ✅ เพิ่ม: ข้อมูลกราฟแท่ง (Price)
  const barData = {
    labels: books.map(b => b.title),
    datasets: [{
      label: 'ราคา (บาท)',
      data: books.map(b => b.price),
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1,
    }]
  };

  return (
    <div style={{ padding: '20px', background: '#f0f2f5' }}>
      <Row gutter={[16, 16]}>
        {/* สรุปตัวเลข */}
        <Col span={8}>
          <Card><Statistic title="จำนวนชื่อหนังสือ" value={books.length} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="จำนวนเล่มรวมทั้งหมด" value={books.reduce((a, b) => a + b.stock, 0)} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="มูลค่ารวมในคลัง" value={books.reduce((a, b) => a + (b.price * b.stock), 0)} precision={2} suffix="฿" /></Card>
        </Col>

        {/* กราฟ */}
        <Col span={12}>
          <Card title="สัดส่วนสต็อกสินค้า (Pie Chart)">
            <Pie data={pieData} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="เปรียบเทียบราคาหนังสือ (Bar Chart)">
            <Bar data={barData} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}