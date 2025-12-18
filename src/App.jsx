import './App.css'
import axios from 'axios'
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import LoginScreen from './LoginScreen'; 
import BookScreen from './BookScreen';
import Dashboard from './components/Dashboard';

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
          <Header style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
              <Menu.Item key="1"><Link to="/">Book Management</Link></Menu.Item>
              <Menu.Item key="2"><Link to="/dashboard">Dashboard</Link></Menu.Item>
            </Menu>
            <Button type="primary" danger onClick={handleLogout} style={{ marginTop: '16px' }}>
              Logout
            </Button>
          </Header>
          <Content>
            <Routes>
              <Route path="/" element={<BookScreen />} />
              <Route path="/dashboard" element={<Dashboard books={books} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Content>
        </Layout>
      )}
    </Router>
  );
}

export default App;