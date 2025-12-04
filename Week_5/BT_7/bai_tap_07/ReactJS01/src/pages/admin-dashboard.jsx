import { useState, useEffect } from 'react';
import { 
    Card, 
    Table, 
    Button, 
    Space, 
    Modal, 
    Form, 
    Input, 
    InputNumber, 
    Select, 
    message, 
    Popconfirm, 
    Tag,
    Image,
    Row,
    Col,
    Statistic
} from 'antd';
import { 
    PlusOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    ShoppingOutlined,
    AppstoreOutlined,
    DollarOutlined,
    InboxOutlined,
    DashboardOutlined
} from '@ant-design/icons';
import { 
    getProductsAPI, 
    createProductAPI, 
    updateProductAPI, 
    deleteProductAPI, 
    getCategoriesAPI 
} from '../util/api';
import './admin-dashboard.css';

const { Option } = Select;
const { TextArea } = Input;

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form] = Form.useForm();
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0);
    
    // Filter
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Statistics
    const [statistics, setStatistics] = useState({
        totalProducts: 0,
        totalCategories: 0,
        totalValue: 0,
        lowStock: 0
    });

    useEffect(() => {
        fetchCategories();
        fetchProducts(currentPage, pageSize, selectedCategory);
    }, [currentPage, pageSize, selectedCategory]);

    const fetchProducts = async (page, limit, categoryId) => {
        setLoading(true);
        try {
            const res = await getProductsAPI(page, limit, categoryId);
            if (res?.EC === 0) {
                setProducts(res.data.products);
                setTotalProducts(res.data.totalProducts);
                
                // Calculate statistics
                const totalValue = res.data.products.reduce((sum, p) => sum + (parseFloat(p.price) * p.stock), 0);
                const lowStock = res.data.products.filter(p => p.stock < 10).length;
                
                setStatistics({
                    totalProducts: res.data.totalProducts,
                    totalCategories: categories.length,
                    totalValue: totalValue,
                    lowStock: lowStock
                });
            } else {
                message.error(res?.EM || 'Không thể tải danh sách sản phẩm');
            }
        } catch (error) {
            message.error('Lỗi khi tải danh sách sản phẩm');
        }
        setLoading(false);
    };

    const fetchCategories = async () => {
        try {
            const res = await getCategoriesAPI();
            if (res?.EC === 0) {
                setCategories(res.data);
            }
        } catch (error) {
            message.error('Lỗi khi tải danh mục');
        }
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        form.setFieldsValue({
            ...product,
            categoryId: product.category?.id
        });
        setModalVisible(true);
    };

    const handleDeleteProduct = async (id) => {
        try {
            const res = await deleteProductAPI(id);
            if (res?.EC === 0) {
                message.success('Xóa sản phẩm thành công');
                fetchProducts(currentPage, pageSize, selectedCategory);
            } else {
                message.error(res?.EM || 'Xóa sản phẩm thất bại');
            }
        } catch (error) {
            message.error('Lỗi khi xóa sản phẩm');
        }
    };

    const handleSubmit = async (values) => {
        try {
            let res;
            if (editingProduct) {
                res = await updateProductAPI(editingProduct.id, values);
            } else {
                res = await createProductAPI(values);
            }

            if (res?.EC === 0) {
                message.success(editingProduct ? 'Cập nhật sản phẩm thành công' : 'Thêm sản phẩm thành công');
                setModalVisible(false);
                form.resetFields();
                fetchProducts(currentPage, pageSize, selectedCategory);
            } else {
                message.error(res?.EM || 'Thao tác thất bại');
            }
        } catch (error) {
            message.error('Lỗi khi lưu sản phẩm');
        }
    };

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const handleCategoryFilter = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1); // Reset về trang 1 khi filter
    };

    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            width: 100,
            render: (image) => (
                <Image
                    src={image || 'https://via.placeholder.com/100'}
                    alt="product"
                    width={60}
                    height={60}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                />
            ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: 'Danh mục',
            dataIndex: ['category', 'name'],
            key: 'category',
            width: 120,
            render: (text) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            render: (price) => `${parseFloat(price).toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Tồn kho',
            dataIndex: 'stock',
            key: 'stock',
            width: 100,
            render: (stock) => (
                <Tag color={stock < 10 ? 'red' : stock < 50 ? 'orange' : 'green'}>
                    {stock}
                </Tag>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditProduct(record)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xác nhận xóa sản phẩm?"
                        onConfirm={() => handleDeleteProduct(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + '₫';
    };

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <div className="admin-header">
                <h1>
                    <DashboardOutlined />
                    Admin Dashboard
                </h1>
                <p>Quản lý sản phẩm và danh mục</p>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} className="stats-grid">
                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card">
                        <div className="stat-card-header green">
                            <div className="stat-title">Tổng sản phẩm</div>
                            <div className="stat-value">
                                <ShoppingOutlined />
                                {statistics.totalProducts}
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card">
                        <div className="stat-card-header blue">
                            <div className="stat-title">Danh mục</div>
                            <div className="stat-value">
                                <AppstoreOutlined />
                                {statistics.totalCategories}
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card">
                        <div className="stat-card-header red">
                            <div className="stat-title">Giá trị kho</div>
                            <div className="stat-value">
                                <DollarOutlined />
                                {formatPrice(statistics.totalValue)}
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card">
                        <div className="stat-card-header orange">
                            <div className="stat-title">Tồn kho thấp</div>
                            <div className="stat-value">
                                <InboxOutlined />
                                {statistics.lowStock}
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Filters and Actions */}
            <Card className="admin-actions-card">
                <div className="admin-actions">
                    <Select
                        placeholder="Lọc theo danh mục"
                        allowClear
                        onChange={handleCategoryFilter}
                        size="large"
                        style={{ minWidth: 200 }}
                    >
                        {categories.map(cat => (
                            <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                        ))}
                    </Select>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddProduct}
                        size="large"
                    >
                        Thêm sản phẩm mới
                    </Button>
                </div>
            </Card>

            {/* Products Table */}
            <Card className="admin-table-card">
                <Table
                    columns={columns}
                    dataSource={products}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalProducts,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} sản phẩm`,
                        pageSizeOptions: ['5', '10', '20', '50'],
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 1200 }}
                    className="custom-table"
                />
            </Card>

            {/* Add/Edit Product Modal */}
            <Modal
                title={
                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                        {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </div>
                }
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={650}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Tên sản phẩm"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                    >
                        <Input placeholder="Nhập tên sản phẩm" />
                    </Form.Item>

                    <Form.Item
                        label="Danh mục"
                        name="categoryId"
                        rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                    >
                        <Select placeholder="Chọn danh mục">
                            {categories.map(cat => (
                                <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Giá (VNĐ)"
                        name="price"
                        rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Tồn kho"
                        name="stock"
                        rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                    >
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>

                    <Form.Item
                        label="URL hình ảnh"
                        name="image"
                    >
                        <Input placeholder="https://example.com/image.jpg" />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                    >
                        <TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                            <Button onClick={() => {
                                setModalVisible(false);
                                form.resetFields();
                            }}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
