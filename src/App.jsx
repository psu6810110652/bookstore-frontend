import './App.css'
import axios from 'axios'
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import LoginScreen from './LoginScreen'; 
import BookScreen from './BookScreen';
import Dashboard from './components/Dashboard';
import CategoryScreen from './CategoryScreen';

const { Header, Content } = Layout;
axios.defaults.baseURL = "http://localhost:3000"

function App() {
  
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('user_token'));
  const [books, setBooks] = useState([]);

  const handleLoginSuccess = (token, remember) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (remember) {
      localStorage.setItem('user_token', token);
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
  };
  <><Routes>
    <Route path="/" element={<BookScreen />} />
    <Route path="/dashboard" element={<Dashboard books={books} />} />
    {/* 2. เพิ่ม Route ใหม่ */}
    <Route path="/category" element={<CategoryScreen />} />
  </Routes><Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
      <Menu.Item key="1"><Link to="/">Books</Link></Menu.Item>
      <Menu.Item key="2"><Link to="/dashboard">Dashboard</Link></Menu.Item>
      {/* 3. เพิ่มปุ่มเมนู */}
      <Menu.Item key="3"><Link to="/category">Categories</Link></Menu.Item>
    </Menu></>

  
  useEffect(() => {
    const savedToken = localStorage.getItem('user_token');
    if (savedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }, []);
  useEffect(() => {
    if (isAuthenticated) {
      axios.get("/api/book")
        .then(res => {
          setBooks(res.data); 
        })
        .catch(err => {
          console.error("Dashboard fetch error:", err);
          if (err.response?.status === 401) handleLogout(); 
        });
    }
  }, [isAuthenticated]);

 return (
    <Router>
      {!isAuthenticated ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{ 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'space-between',
  background: '#001529',
  padding: '0 24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  zIndex: 1
}}>
  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
    <div className="logo-text" style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', marginRight: '40px' }}>
      📚 BOOKSTORE
    </div>
    <Menu 
      theme="dark" 
      mode="horizontal" 
      defaultSelectedKeys={['1']}
      style={{ flex: 1, borderBottom: 'none' }}
    >
      <Menu.Item key="1"><Link to="/">Books</Link></Menu.Item>
      <Menu.Item key="2"><Link to="/dashboard">Dashboard</Link></Menu.Item>
      <Menu.Item key="3"><Link to="/category">Categories</Link></Menu.Item>
    </Menu>
  </div>
  <Button type="primary" danger onClick={handleLogout} style={{ borderRadius: '6px' }}>
    Logout
  </Button>
</Header>
          <Content>
            <Routes>
              <Route path="/" element={<BookScreen />} />
              <Route path="/dashboard" element={<Dashboard books={books} />} />
              {/* ตรวจสอบว่ามี Route สำหรับหน้า Category แล้ว */}
              <Route path="/category" element={<CategoryScreen />} /> 
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Content>
        </Layout>
      )}
    </Router>
  );
}

export default App;
