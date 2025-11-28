import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Button, Drawer } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  AppstoreOutlined, 
  CoffeeOutlined, 
  UserOutlined, 
  ShoppingCartOutlined, 
  BarChartOutlined,
  SettingOutlined,
  MenuOutlined,
  LogoutOutlined
} from '@ant-design/icons';

import PratosPage from './pages/PratosPage';
import ClientesPage from './pages/ClientesPage';
import PedidosPage from './pages/PedidosPage';
import RelatorioPedidosPorCliente from './pages/RelatorioPedidosPorCliente';

const { Sider, Content } = Layout;

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = (e) => {
      setIsMobile(e.matches);
      if (!e.matches) setMobileMenuOpen(false);
    };
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/clientes') return '1';
    if (path === '/') return '2';
    if (path === '/pedidos') return '3';
    if (path === '/relatorio') return '4';
    return '2';
  };

  const menuItems = [
    { key: 'dashboard', icon: <AppstoreOutlined />, label: 'Dashboard', disabled: true },
    { key: '1', icon: <UserOutlined />, label: <Link to="/clientes">Clientes</Link> },
    { key: '2', icon: <CoffeeOutlined />, label: <Link to="/">Pratos</Link> },
    { key: '3', icon: <ShoppingCartOutlined />, label: <Link to="/pedidos">Pedidos</Link> },
    { key: '4', icon: <BarChartOutlined />, label: <Link to="/relatorio">Relatórios</Link> },
  ];

  const MenuContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo Area */}
      <div style={{ 
        height: '80px', 
        display: 'flex', 
        alignItems: 'center', 
        paddingLeft: '24px',
        gap: '12px'
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #F28A2E 0%, #FFAD66 100%)', 
          borderRadius: '10px', 
          padding: '8px',
          boxShadow: '0 4px 12px rgba(242, 138, 46, 0.3)'
        }}>
          <CoffeeOutlined style={{ fontSize: '20px', color: 'white' }} />
        </div>
        <span style={{ color: 'white', fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' }}>
          RestaurantePro
        </span>
      </div>

      {/* Menu */}
      <div style={{ flex: 1, padding: '0 12px' }}>
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[getSelectedKey()]} 
          items={menuItems} 
          onClick={() => setMobileMenuOpen(false)}
          style={{ background: 'transparent', border: 'none' }} 
        />
      </div>
      
      {/* User Profile Footer */}
      <div style={{ padding: '20px' }}>
         <div style={{ 
           background: '#261E1B', 
           borderRadius: '16px', 
           padding: '16px', 
           display: 'flex', 
           alignItems: 'center', 
           gap: '12px',
           border: '1px solid rgba(255,255,255,0.05)'
         }}>
            <Avatar style={{ backgroundColor: '#F28A2E' }} icon={<UserOutlined />} size="large" />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>Admin</div>
              <div style={{ color: '#9CA3AF', fontSize: '12px' }}>Gerente</div>
            </div>
            <Button type="text" icon={<LogoutOutlined style={{ color: '#9CA3AF' }} />} />
         </div>
      </div>
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh', background: '#F7F3EF' }}>
      
      {/* SIDEBAR DESKTOP */}
      <Sider 
        width={260} 
        style={{ 
          background: '#1A1410', 
          position: 'fixed', 
          height: '100vh', 
          zIndex: 100,
          left: 0,
          borderRight: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        {MenuContent}
      </Sider>

      {/* DRAWER MOBILE */}
      <Drawer
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
        styles={{ body: { padding: 0, background: '#1A1410' } }}
        closable={false}
      >
        {MenuContent}
      </Drawer>

      {/* LAYOUT PRINCIPAL */}
      <Layout style={{ 
        marginLeft: isMobile ? 0 : 260, 
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
        background: '#F7F3EF'
      }}>
        
        {/* HEADER MOBILE */}
        {isMobile && (
          <div className="mobile-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Button 
                type="text" 
                icon={<MenuOutlined style={{ color: 'white', fontSize: '22px' }} />} 
                onClick={() => setMobileMenuOpen(true)} 
              />
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>RestaurantePro</span>
            </div>
            <Avatar style={{ backgroundColor: '#F28A2E' }} icon={<UserOutlined />} />
          </div>
        )}

        <Content style={{ 
          margin: isMobile ? '24px 16px' : '40px 48px', 
          paddingBottom: '40px',
          maxWidth: '1200px',
          width: '100%',
          alignSelf: 'center'
        }}>
          <Routes>
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/" element={<PratosPage />} />
            <Route path="/pedidos" element={<PedidosPage />} />
            <Route path="/relatorio" element={<RelatorioPedidosPorCliente />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}