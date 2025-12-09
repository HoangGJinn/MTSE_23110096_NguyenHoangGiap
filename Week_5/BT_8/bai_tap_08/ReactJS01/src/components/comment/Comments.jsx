import React, { useState, useEffect, useContext } from 'react';
import { Card, List, Input, Button, Rate, Avatar, App, Popconfirm, Empty, Pagination } from 'antd';
import { UserOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import { createCommentAPI, getCommentsAPI, deleteCommentAPI } from '../../util/api';
import { AuthContext } from '../context/auth.context';
import './Comments.css';

const { TextArea } = Input;

const Comments = ({ productId }) => {
    const { message } = App.useApp();
    const { auth } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 5;

    useEffect(() => {
        fetchComments();
    }, [productId, page]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await getCommentsAPI(productId, page, limit);
            // Axios interceptor đã unwrap response.data
            if (response && response.EC === 0 && response.data) {
                setComments(response.data.comments);
                setTotal(response.data.totalComments);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            message.error('Lỗi khi tải bình luận');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!auth.isAuthenticated) {
            message.warning('Vui lòng đăng nhập để bình luận');
            return;
        }

        if (!content.trim()) {
            message.warning('Vui lòng nhập nội dung bình luận');
            return;
        }

        setSubmitting(true);
        try {
            const response = await createCommentAPI(productId, content, rating > 0 ? rating : null);
            // Axios interceptor đã unwrap response.data
            if (response && response.EC === 0) {
                message.success('Đã thêm bình luận');
                setContent('');
                setRating(0);
                fetchComments();
            } else {
                message.error(response?.EM || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error creating comment:', error);
            message.error('Lỗi khi thêm bình luận');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            const response = await deleteCommentAPI(commentId);
            // Axios interceptor đã unwrap response.data
            if (response && response.EC === 0) {
                message.success('Đã xóa bình luận');
                fetchComments();
            } else {
                message.error(response?.EM || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            message.error('Lỗi khi xóa bình luận');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="comments-container">
            <Card title="Bình luận" className="comments-card">
                {auth.isAuthenticated && (
                    <div className="comment-form">
                        <div style={{ marginBottom: 10 }}>
                            <Rate value={rating} onChange={setRating} />
                            <span style={{ marginLeft: 10, color: '#666' }}>
                                {rating > 0 ? `${rating} sao` : 'Đánh giá (tùy chọn)'}
                            </span>
                        </div>
                        <TextArea
                            rows={4}
                            placeholder="Nhập bình luận của bạn..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            maxLength={500}
                            showCount
                        />
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={handleSubmit}
                            loading={submitting}
                            style={{ marginTop: 10 }}
                        >
                            Gửi bình luận
                        </Button>
                    </div>
                )}

                {!auth.isAuthenticated && (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: '#999' }}>
                        Vui lòng đăng nhập để bình luận
                    </div>
                )}

                <List
                    loading={loading}
                    dataSource={comments}
                    locale={{ emptyText: <Empty description="Chưa có bình luận nào" /> }}
                    renderItem={(comment) => (
                        <List.Item
                            className="comment-item"
                            actions={
                                auth.isAuthenticated &&
                                (auth.user?.id === comment.userId || auth.user?.role === 'Admin') ? [
                                    <Popconfirm
                                        title="Bạn có chắc muốn xóa bình luận này?"
                                        onConfirm={() => handleDelete(comment.id)}
                                        okText="Xóa"
                                        cancelText="Hủy"
                                    >
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            size="small"
                                        >
                                            Xóa
                                        </Button>
                                    </Popconfirm>
                                ] : []
                            }
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar icon={<UserOutlined />} />
                                }
                                title={
                                    <div>
                                        <strong>{comment.user?.name || 'Người dùng'}</strong>
                                        {comment.rating && (
                                            <Rate
                                                disabled
                                                value={comment.rating}
                                                style={{ marginLeft: 10, fontSize: 12 }}
                                            />
                                        )}
                                    </div>
                                }
                                description={
                                    <div>
                                        <div style={{ marginBottom: 8 }}>{comment.content}</div>
                                        <div style={{ fontSize: 12, color: '#999' }}>
                                            {formatDate(comment.createdAt)}
                                        </div>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />

                {total > limit && (
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <Pagination
                            current={page}
                            total={total}
                            pageSize={limit}
                            onChange={setPage}
                            showSizeChanger={false}
                        />
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Comments;

