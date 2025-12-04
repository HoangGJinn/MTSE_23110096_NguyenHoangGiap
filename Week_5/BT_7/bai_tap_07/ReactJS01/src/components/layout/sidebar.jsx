import React, { useState, useEffect } from "react";
import { 
    LaptopOutlined, 
    DesktopOutlined,
    ThunderboltOutlined,
    DollarOutlined,
    FilterOutlined,
    CloseOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import { Card, Checkbox, Slider, Button, Drawer } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCategoriesAPI } from "../../util/api";
import "./sidebar.css";

const Sidebar = ({ isMobile, onClose, isFloating = false }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 100000000]);
    const [categories, setCategories] = useState([]);

    // Icon và color mapping
    const categoryConfig = {
        'Văn phòng': { icon: <LaptopOutlined />, color: '#52c41a' },
        'Gaming': { icon: <ThunderboltOutlined />, color: '#ff4d4f' },
        'Đồ họa': { icon: <DesktopOutlined />, color: '#1890ff' },
        'Doanh nhân': { icon: <DollarOutlined />, color: '#722ed1' },
    };

    // Load categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategoriesAPI();
                if (response && response.EC === 0 && response.data) {
                    const categoriesWithConfig = response.data.map(cat => ({
                        ...cat,
                        icon: categoryConfig[cat.name]?.icon || <LaptopOutlined />,
                        color: categoryConfig[cat.name]?.color || '#666'
                    }));
                    setCategories(categoriesWithConfig);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const category = searchParams.get('category');
        setSelectedCategory(category ? parseInt(category) : null);
    }, [searchParams]);

    const handleCategoryClick = (categoryId) => {
        if (selectedCategory === categoryId) {
            setSelectedCategory(null);
            navigate('/');
        } else {
            setSelectedCategory(categoryId);
            navigate(`/?category=${categoryId}`);
        }
    };

    const handlePriceChange = (value) => {
        setPriceRange(value);
    };

    const handleReset = () => {
        setSelectedCategory(null);
        setPriceRange([0, 100000000]);
        navigate('/');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    };

    const sidebarContent = (
        <div className="sidebar-container">
            <div className="sidebar-header">
                <h3 className="sidebar-title">
                    <FilterOutlined /> Bộ lọc
                </h3>
                {(isMobile || isFloating) && onClose && (
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={onClose}
                        className="close-btn"
                    />
                )}
            </div>

            {/* Categories Filter */}
            <Card className="filter-card" title="Danh mục">
                <div className="category-list">
                    <div
                        className={`category-item ${!selectedCategory ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedCategory(null);
                            navigate('/');
                        }}
                    >
                        <span className="category-icon" style={{ color: '#1890ff' }}>
                            <AppstoreOutlined />
                        </span>
                        <span className="category-name">Tất cả</span>
                    </div>
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(category.id)}
                        >
                            <span className="category-icon" style={{ color: category.color }}>
                                {category.icon}
                            </span>
                            <span className="category-name">{category.name}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Price Filter */}
            <Card className="filter-card" title="Khoảng giá">
                <div className="price-filter">
                    <Slider
                        range
                        min={0}
                        max={100000000}
                        step={1000000}
                        value={priceRange}
                        onChange={handlePriceChange}
                        tooltip={{
                            formatter: (value) => formatPrice(value)
                        }}
                    />
                    <div className="price-range-display">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span> - </span>
                        <span>{formatPrice(priceRange[1])}</span>
                    </div>
                </div>
            </Card>

            {/* Reset Button */}
            <Button
                type="default"
                block
                onClick={handleReset}
                className="reset-btn"
            >
                Xóa bộ lọc
            </Button>
        </div>
    );

    // Nếu là floating sidebar, luôn render content trực tiếp
    if (isFloating) {
        return sidebarContent;
    }

    // Nếu là mobile và không phải floating, dùng Drawer
    if (isMobile) {
        return (
            <Drawer
                title="Bộ lọc"
                placement="left"
                onClose={onClose}
                open={true}
                width={300}
                className="sidebar-drawer"
            >
                {sidebarContent}
            </Drawer>
        );
    }

    return sidebarContent;
};

export default Sidebar;

