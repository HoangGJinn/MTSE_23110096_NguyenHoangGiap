import React from 'react';
import { Button } from 'antd';
import { ShoppingCartOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Banner.css';

const Banner = () => {
    const navigate = useNavigate();

    const handleShopNow = () => {
        navigate('/');
        // Scroll to products section
        setTimeout(() => {
            const productsSection = document.querySelector('.products-grid');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    return (
        <div className="promo-banner">
            <div className="banner-background">
                <div className="circuit-pattern"></div>
                <div className="glow-effect"></div>
            </div>
            
            <div className="banner-content">
                <div className="banner-left">
                    <div className="brand-section">
                        <h1 className="brand-name">GIAP LAPTOP</h1>
                        <p className="brand-slogan">Uy Tín - Chất Lượng - Giá Cạnh Tranh</p>
                    </div>
                </div>

                <div className="banner-center">
                    <div className="laptops-display">
                        <div className="laptop-item laptop-1">
                            <div className="laptop-screen">
                                <div className="screen-content windows-screen"></div>
                            </div>
                            <div className="laptop-keyboard blue-backlight"></div>
                        </div>
                        <div className="laptop-item laptop-2">
                            <div className="laptop-screen">
                                <div className="screen-content gaming-screen"></div>
                            </div>
                            <div className="laptop-keyboard red-accent"></div>
                        </div>
                        <div className="laptop-item laptop-3">
                            <div className="laptop-screen">
                                <div className="screen-content apple-screen"></div>
                            </div>
                        </div>
                        <div className="laptop-item laptop-4">
                            <div className="laptop-screen">
                                <div className="screen-content windows-screen"></div>
                            </div>
                            <div className="laptop-keyboard"></div>
                        </div>
                    </div>
                    
                    <Button 
                        type="primary" 
                        size="large"
                        icon={<ShoppingCartOutlined />}
                        className="shop-now-btn"
                        onClick={handleShopNow}
                    >
                        MUA SẮM NGAY
                    </Button>
                </div>

                <div className="banner-right">
                    <div className="sale-badge">
                        <div className="sale-percent">SALE 40%</div>
                    </div>
                    <div className="promo-text">
                        <h2 className="promo-title">ƯU ĐÃI LỚN</h2>
                        <div className="promo-subtitle">Mừng Sang Hè 2025</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;

