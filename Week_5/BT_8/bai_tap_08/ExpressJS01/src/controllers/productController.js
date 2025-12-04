const {
    getProductsService,
    getProductByIdService,
    createProductService,
    updateProductService,
    deleteProductService,
    getCategoriesService
} = require('../services/productService');

// Lấy danh sách sản phẩm với pagination
const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, categoryId, search } = req.query;
        
        // Parse categoryId to integer if exists
        const parsedCategoryId = categoryId ? parseInt(categoryId) : null;
        
        // Lấy search query (có thể null hoặc undefined)
        const searchQuery = search && search.trim() !== '' ? search.trim() : null;
        
        const data = await getProductsService(page, limit, parsedCategoryId, searchQuery);
        
        if (!data) {
            return res.status(500).json({
                EC: -1,
                EM: "Server error"
            });
        }

        return res.status(200).json({
            EC: 0,
            EM: "Get products success",
            data
        });
    } catch (error) {
        console.error('getProducts Error:', error);
        return res.status(500).json({ EC: -1, EM: "Server error" });
    }
};

// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const includeStats = req.query.stats === 'true';
        
        // Validate id
        const productId = parseInt(id);
        if (isNaN(productId)) {
            return res.status(400).json({
                EC: 1,
                EM: "ID sản phẩm không hợp lệ"
            });
        }
        
        const product = await getProductByIdService(productId, includeStats);
        
        if (!product) {
            return res.status(404).json({
                EC: 1,
                EM: "Sản phẩm không tồn tại"
            });
        }

        return res.status(200).json({
            EC: 0,
            EM: "Get product success",
            data: product
        });
    } catch (error) {
        console.error('getProductById Error:', error);
        console.error('Error stack:', error.stack);
        return res.status(500).json({ EC: -1, EM: "Server error: " + error.message });
    }
};

// Tạo sản phẩm mới (Admin only)
const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, stock, categoryId } = req.body;

        if (!name || !price || !categoryId) {
            return res.status(400).json({
                EC: 1,
                EM: "Name, price và categoryId là bắt buộc"
            });
        }

        const data = await createProductService(name, description, price, image, stock, categoryId);

        if (!data) {
            return res.status(500).json({
                EC: -1,
                EM: "Tạo sản phẩm thất bại"
            });
        }

        if (data.error) {
            return res.status(400).json({
                EC: 1,
                EM: data.error
            });
        }

        return res.status(201).json({
            EC: 0,
            EM: "Tạo sản phẩm thành công",
            data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: -1, EM: "Server error" });
    }
};

// Cập nhật sản phẩm (Admin only)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const data = await updateProductService(id, updateData);

        if (!data) {
            return res.status(500).json({
                EC: -1,
                EM: "Cập nhật sản phẩm thất bại"
            });
        }

        if (data.error) {
            return res.status(400).json({
                EC: 1,
                EM: data.error
            });
        }

        return res.status(200).json({
            EC: 0,
            EM: "Cập nhật sản phẩm thành công",
            data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: -1, EM: "Server error" });
    }
};

// Xóa sản phẩm (Admin only)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await deleteProductService(id);

        if (!data) {
            return res.status(500).json({
                EC: -1,
                EM: "Xóa sản phẩm thất bại"
            });
        }

        if (data.error) {
            return res.status(404).json({
                EC: 1,
                EM: data.error
            });
        }

        return res.status(200).json({
            EC: 0,
            EM: "Xóa sản phẩm thành công"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: -1, EM: "Server error" });
    }
};

// Lấy tất cả categories
const getCategories = async (req, res) => {
    try {
        const categories = await getCategoriesService();

        if (!categories) {
            return res.status(500).json({
                EC: -1,
                EM: "Server error"
            });
        }

        return res.status(200).json({
            EC: 0,
            EM: "Get categories success",
            data: categories
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: -1, EM: "Server error" });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories
};
