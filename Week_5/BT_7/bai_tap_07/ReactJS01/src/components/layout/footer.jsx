import React, { useState, useEffect } from "react";
import { 
    FacebookOutlined, 
    TwitterOutlined, 
    InstagramOutlined, 
    YoutubeOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import { Link } from "react-router-dom";
import { getCategoriesAPI } from "../../util/api";
import "./footer.css";

const Footer = () => {
    const [categories, setCategories] = useState([]);

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
    return (
        <footer className="footer-container">
            <div className="footer-main">
                <div className="container mx-auto px-4">
                    <div className="footer-grid">
                        {/* About Section */}
                        <div className="footer-section">
                            <h3 className="footer-title">Về Laptop Store</h3>
                            <p className="footer-text">
                                Chuyên cung cấp laptop chính hãng, chất lượng cao với giá cả hợp lý. 
                                Cam kết bảo hành và hỗ trợ khách hàng tận tâm.
                            </p>
                            <div className="social-links">
                                <a href="#" className="social-link" aria-label="Facebook">
                                    <FacebookOutlined />
                                </a>
                                <a href="#" className="social-link" aria-label="Twitter">
                                    <TwitterOutlined />
                                </a>
                                <a href="#" className="social-link" aria-label="Instagram">
                                    <InstagramOutlined />
                                </a>
                                <a href="#" className="social-link" aria-label="Youtube">
                                    <YoutubeOutlined />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-section">
                            <h3 className="footer-title">Liên kết nhanh</h3>
                            <ul className="footer-links">
                                <li><Link to="/">Trang chủ</Link></li>
                                {categories.map(category => (
                                    <li key={category.id}>
                                        <Link to={`/?category=${category.id}`}>
                                            Laptop {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support */}
                        <div className="footer-section">
                            <h3 className="footer-title">Hỗ trợ</h3>
                            <ul className="footer-links">
                                <li><Link to="/">Hướng dẫn mua hàng</Link></li>
                                <li><Link to="/">Chính sách bảo hành</Link></li>
                                <li><Link to="/">Chính sách đổi trả</Link></li>
                                <li><Link to="/">Câu hỏi thường gặp</Link></li>
                                <li><Link to="/">Liên hệ</Link></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="footer-section">
                            <h3 className="footer-title">Thông tin liên hệ</h3>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <PhoneOutlined className="contact-icon" />
                                    <span>9999 9999</span>
                                </div>
                                <div className="contact-item">
                                    <MailOutlined className="contact-icon" />
                                    <span>support@laptopstore.com</span>
                                </div>
                                <div className="contact-item">
                                    <EnvironmentOutlined className="contact-icon" />
                                    <span>1 Võ Văn Ngân, Phường Thủ Đức, Thành phố Hồ Chí Minh</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="container mx-auto px-4">
                    <div className="footer-bottom-content">
                        <p className="copyright">
                            © 2025 Giap Laptop. Đồ án môn học Công nghệ Phần mềm.
                        </p>
                        <div className="footer-bottom-links">
                            <Link to="/">Điều khoản sử dụng</Link>
                            <span className="separator">|</span>
                            <Link to="/">Chính sách bảo mật</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

