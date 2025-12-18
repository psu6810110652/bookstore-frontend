import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Card, Row, Col } from 'antd';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Dashboard({ books }) {
  // ข้อมูลสำหรับกราฟวงกลม: แสดง Stock ของหนังสือแต่ละเล่ม
  const pieData = {
    labels: books.map(b => b.title),
    datasets: [{
      label: 'Stock Amount',
      data: books.map(b => b.stock),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
    }]
  };

  return (
    <div style={{ padding: '30px' }}>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Book Stock Inventory">
            <Pie data={pieData} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Quick Stats">
            <h2>Total Unique Titles: {books.length}</h2>
            <h3>Total Items in Stock: {books.reduce((acc, curr) => acc + curr.stock, 0)}</h3>
          </Card>
        </Col>
      </Row>
    </div>
  );
}