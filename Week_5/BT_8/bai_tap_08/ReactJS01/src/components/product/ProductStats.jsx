import React, { useState, useEffect } from 'react';
import { Statistic, Row, Col, Card } from 'antd';
import { ShoppingOutlined, CommentOutlined } from '@ant-design/icons';
import { getProductStatsAPI } from '../../util/api';
import './ProductStats.css';

const ProductStats = ({ productId }) => {
    const [stats, setStats] = useState({ purchaseCount: 0, commentCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, [productId]);

    const fetchStats = async () => {
        try {
            const response = await getProductStatsAPI(productId);
            if (response && response.data && response.data.EC === 0) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="product-stats-card" loading={loading}>
            <Row gutter={16}>
                <Col span={12}>
                    <Statistic
                        title="Khách đã mua"
                        value={stats.purchaseCount}
                        prefix={<ShoppingOutlined />}
                        valueStyle={{ color: '#3f8600' }}
                    />
                </Col>
                <Col span={12}>
                    <Statistic
                        title="Bình luận"
                        value={stats.commentCount}
                        prefix={<CommentOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Col>
            </Row>
        </Card>
    );
};

export default ProductStats;

