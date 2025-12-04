import React, { useContext, useState, useEffect } from "react";
import { 
    SearchOutlined, 
    ShoppingCartOutlined, 
    UserOutlined, 
    LogoutOutlined,
    LoginOutlined,
    HomeOutlined,
    MenuOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import { Input, Badge, Dropdown, Button, Drawer, App } from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { getCategoriesAPI } from "../../util/api";
import axios from "../../util/axios.customize";
import "./header.css";

const Header = ({ onOpenLogin, onOpenRegister }) => {
    const { message } = App.useApp(); // Sử dụng hook để lấy message API
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { auth, setAuth } = useContext(AuthContext);
    const [searchValue, setSearchValue] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    const handleCartClick = (e) => {
        if (!auth.isAuthenticated) {
            e.preventDefault();
            message.warning('Vui lòng đăng nhập để xem giỏ hàng');
            if (onOpenLogin) {
                setTimeout(() => onOpenLogin(), 500);
            }
        }
    };

    // Sync search value with URL
    useEffect(() => {
        const searchFromUrl = searchParams.get('search');
        if (searchFromUrl) {
            setSearchValue(searchFromUrl);
        } else {
            setSearchValue("");
        }
    }, [searchParams]);

    // Load categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategoriesAPI();
                if (response && response.EC === 0 && response.data) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleLogout = async () => {
        try {
            // Gọi API logout để xóa cookie và session ở backend
            await axios.post('v1/api/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Xóa token khỏi localStorage
            localStorage.removeItem("access_token");
            localStorage.removeItem("rememberMe");
            
            setAuth({
                isAuthenticated: false,
                user: { email: "", name: "", role: "" }
            });
            navigate("/");
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            const trimmedValue = searchValue.trim();
            if (trimmedValue) {
                // Navigate to search results with fuzzy search
                navigate(`/?search=${encodeURIComponent(trimmedValue)}`);
            } else {
                // Clear search if empty
                navigate('/');
            }
        }
    };

    const handleSearchButtonClick = () => {
        const trimmedValue = searchValue.trim();
        if (trimmedValue) {
            navigate(`/?search=${encodeURIComponent(trimmedValue)}`);
        } else {
            navigate('/');
        }
    };

    const userMenuItems = auth.isAuthenticated ? [
        {
            key: 'profile',
            label: (
                <Link to="/profile" className="flex items-center gap-2">
                    <UserOutlined /> Thông tin tài khoản
                </Link>
            ),
        },
        ...(auth.user?.role === 'Admin' ? [
            {
                key: 'admin',
                label: (
                    <Link to="/admin" className="flex items-center gap-2">
                        <UserOutlined /> Admin Dashboard
                    </Link>
                ),
            },
            {
                key: 'users',
                label: (
                    <Link to="/user" className="flex items-center gap-2">
                        <UserOutlined /> Quản lý tài khoản
                    </Link>
                ),
            },
        ] : []),
        {
            key: 'logout',
            label: (
                <span onClick={handleLogout} className="flex items-center gap-2 text-red-500">
                    <LogoutOutlined /> Đăng xuất
                </span>
            ),
        },
    ] : [
        {
            key: 'login',
            label: (
                <span 
                    onClick={() => onOpenLogin && onOpenLogin()} 
                    className="flex items-center gap-2"
                    style={{ cursor: 'pointer' }}
                >
                    <LoginOutlined /> Đăng nhập
                </span>
            ),
        },
        {
            key: 'register',
            label: (
                <span 
                    onClick={() => onOpenRegister && onOpenRegister()} 
                    className="flex items-center gap-2"
                    style={{ cursor: 'pointer' }}
                >
                    <UserOutlined /> Đăng ký
                </span>
            ),
        },
    ];

    return (
        <header className="header-container">
            <div className="header-main">
                <div className="container">
                    <div className="flex" style={{ padding: '1rem 0' }}>
                        {/* Logo */}
                        <Link to="/" className="logo-section">
                            <div className="logo-icon">💻</div>
                            <div className="logo-text">
                                <h1 className="logo-title">Giap Laptop</h1>
                                <p className="logo-subtitle">Cửa hàng laptop uy tín - UTE</p>
                            </div>
                        </Link>

                        {/* Search Bar */}
                        <div className="search-section">
                            <Input
                                size="large"
                                placeholder="Tìm kiếm laptop, phụ kiện..."
                                prefix={<SearchOutlined />}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onPressEnter={handleSearch}
                                onBlur={handleSearchButtonClick}
                                allowClear
                                className="search-input"
                            />
                        </div>

                        {/* Right Actions */}
                        <div className="header-actions">
                            <Link to="/cart" className="action-item" onClick={handleCartClick}>
                                <Badge count={0} showZero={false}>
                                    <ShoppingCartOutlined className="text-2xl" />
                                </Badge>
                                <span className="action-label">Giỏ hàng</span>
                            </Link>

                            <Dropdown
                                menu={{ items: userMenuItems }}
                                placement="bottomRight"
                                trigger={['click']}
                            >
                                <div className="action-item cursor-pointer">
                                    <UserOutlined className="text-2xl" />
                                    <span className="action-label">Tài khoản</span>
                                </div>
                            </Dropdown>

                            {/* Mobile Menu Button */}
                            <Button
                                type="text"
                                icon={<MenuOutlined />}
                                className="mobile-menu-btn"
                                onClick={() => setMobileMenuOpen(true)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <nav className="header-nav">
                <div className="container">
                    <div className="flex">
                        <div className="nav-links">
                            <Link to="/" className="nav-link">
                                <HomeOutlined /> Trang chủ
                            </Link>
                            
                            {/* Dropdown tất cả danh mục */}
                            {categories.length > 0 && (
                                <Dropdown
                                    menu={{
                                        items: categories.map(category => ({
                                            key: category.id,
                                            label: (
                                                <Link to={`/?category=${category.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    {category.name}
                                                </Link>
                                            )
                                        }))
                                    }}
                                    placement="bottomLeft"
                                    trigger={['hover', 'click']}
                                >
                                    <div className="nav-link nav-link-dropdown">
                                        <AppstoreOutlined /> Tất cả danh mục
                                    </div>
                                </Dropdown>
                            )}
                            
                            {categories.map(category => (
                                <Link 
                                    key={category.id} 
                                    to={`/?category=${category.id}`} 
                                    className="nav-link"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            <Drawer
                title="Menu"
                placement="right"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                className="mobile-drawer"
            >
                <div className="mobile-menu">
                    <Link to="/" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
                        <HomeOutlined /> Trang chủ
                    </Link>
                    {categories.map(category => (
                        <Link 
                            key={category.id}
                            to={`/?category=${category.id}`} 
                            className="mobile-menu-item" 
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {category.name}
                        </Link>
                    ))}
                    {auth.isAuthenticated && (
                        <>
                            <Link to="/profile" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
                                <UserOutlined /> Thông tin tài khoản
                            </Link>
                            {auth.user?.role === 'Admin' && (
                                <>
                                    <Link to="/admin" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
                                        Admin Dashboard
                                    </Link>
                                    <Link to="/user" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
                                        <UserOutlined /> Quản lý tài khoản
                                    </Link>
                                </>
                            )}
                            <div className="mobile-menu-item text-red-500" onClick={handleLogout}>
                                <LogoutOutlined /> Đăng xuất
                            </div>
                        </>
                    )}
                </div>
            </Drawer>
        </header>
    );
};

export default Header;
