import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";
import Footer from "./footer";
import LoginModal from "../modals/LoginModal";
import RegisterModal from "../modals/RegisterModal";
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { Button } from "antd";
import "./layout.css";

const Layout = ({ children }) => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false); // Desktop sidebar toggle
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    
    // Ẩn sidebar khi ở trang admin, user management, hoặc profile
    const isAdminPage = location.pathname === '/admin';
    const isUserPage = location.pathname === '/user';
    const isProfilePage = location.pathname === '/profile';
    const hideSidebar = isAdminPage || isUserPage || isProfilePage;

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Layout cho admin, user management, và profile (không có sidebar và footer)
    if (hideSidebar) {
        return (
            <div className="layout-container admin-layout">
                <Header 
                    onOpenLogin={() => setLoginModalOpen(true)}
                    onOpenRegister={() => setRegisterModalOpen(true)}
                />
                <div className="layout-content admin-content">
                    <div className="container mx-auto px-4">
                        <main className="layout-main admin-main">
                            {children}
                        </main>
                    </div>
                </div>
                
                {/* Login Modal */}
                <LoginModal
                    open={loginModalOpen}
                    onClose={() => setLoginModalOpen(false)}
                    onSwitchToRegister={() => setRegisterModalOpen(true)}
                />
                
                {/* Register Modal */}
                <RegisterModal
                    open={registerModalOpen}
                    onClose={() => setRegisterModalOpen(false)}
                    onSwitchToLogin={() => setLoginModalOpen(true)}
                />
            </div>
        );
    }

    // Layout bình thường cho các trang khác
    return (
        <div className="layout-container">
            <Header 
                onOpenLogin={() => setLoginModalOpen(true)}
                onOpenRegister={() => setRegisterModalOpen(true)}
            />
            
            <div className="layout-content">
                <div className="container mx-auto px-4">
                    {/* Floating Arrow Button - Left side, middle of screen */}
                    {!hideSidebar && (
                        <Button
                            type="primary"
                            icon={sidebarVisible || sidebarOpen ? <LeftOutlined /> : <RightOutlined />}
                            onClick={() => {
                                if (isMobile) {
                                    setSidebarOpen(!sidebarOpen);
                                } else {
                                    setSidebarVisible(!sidebarVisible);
                                }
                            }}
                            className={`floating-arrow-btn ${sidebarVisible || sidebarOpen ? 'sidebar-open' : ''}`}
                            size="large"
                            shape="circle"
                        />
                    )}

                    {/* Floating Sidebar Overlay */}
                    {!hideSidebar && (sidebarVisible || sidebarOpen) && (
                        <>
                            {/* Backdrop */}
                            <div 
                                className="sidebar-backdrop"
                                onClick={() => {
                                    if (isMobile) {
                                        setSidebarOpen(false);
                                    } else {
                                        setSidebarVisible(false);
                                    }
                                }}
                            />
                            
                            {/* Floating Sidebar */}
                            <aside className={`floating-sidebar ${sidebarVisible || sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                                <Sidebar 
                                    isMobile={isMobile} 
                                    isFloating={true}
                                    onClose={() => {
                                        if (isMobile) {
                                            setSidebarOpen(false);
                                        } else {
                                            setSidebarVisible(false);
                                        }
                                    }} 
                                />
                            </aside>
                        </>
                    )}

                    {/* Main Content */}
                    <main className="layout-main">
                        {children}
                    </main>
                </div>
            </div>

            <Footer />
            
            {/* Login Modal */}
            <LoginModal
                open={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                onSwitchToRegister={() => setRegisterModalOpen(true)}
            />
            
            {/* Register Modal */}
            <RegisterModal
                open={registerModalOpen}
                onClose={() => setRegisterModalOpen(false)}
                onSwitchToLogin={() => setLoginModalOpen(true)}
            />
        </div>
    );
};

export default Layout;

