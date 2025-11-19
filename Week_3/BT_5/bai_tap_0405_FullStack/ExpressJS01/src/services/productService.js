const db = require('../../models');
const Product = db.Product;
const Category = db.Category;

// Lấy tất cả sản phẩm với pagination và filter theo category
const getProductsService = async (page = 1, limit = 10, categoryId = null) => {
    try {
        const offset = (page - 1) * limit;
        
        const whereClause = categoryId ? { categoryId } : {};
        
        const { count, rows } = await Product.findAndCountAll({
            where: whereClause,
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        return {
            products: rows,
            totalProducts: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        };
    } catch (error) {
        console.log("Lỗi getProductsService: ", error);
        return null;
    }
};

// Lấy sản phẩm theo ID
const getProductByIdService = async (id) => {
    try {
        const product = await Product.findByPk(id, {
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'description']
            }]
        });
        return product;
    } catch (error) {
        console.log("Lỗi getProductByIdService: ", error);
        return null;
    }
};

// Tạo sản phẩm mới
const createProductService = async (name, description, price, image, stock, categoryId) => {
    try {
        // Kiểm tra category có tồn tại không
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return { error: "Category không tồn tại" };
        }

        const product = await Product.create({
            name,
            description,
            price,
            image,
            stock,
            categoryId
        });

        return product;
    } catch (error) {
        console.log("Lỗi createProductService: ", error);
        return null;
    }
};

// Cập nhật sản phẩm
const updateProductService = async (id, updateData) => {
    try {
        const product = await Product.findByPk(id);
        
        if (!product) {
            return { error: "Sản phẩm không tồn tại" };
        }

        // Nếu có categoryId, kiểm tra category có tồn tại
        if (updateData.categoryId) {
            const category = await Category.findByPk(updateData.categoryId);
            if (!category) {
                return { error: "Category không tồn tại" };
            }
        }

        await product.update(updateData);
        
        return await Product.findByPk(id, {
            include: [{
                model: Category,
                as: 'category'
            }]
        });
    } catch (error) {
        console.log("Lỗi updateProductService: ", error);
        return null;
    }
};

// Xóa sản phẩm
const deleteProductService = async (id) => {
    try {
        const product = await Product.findByPk(id);
        
        if (!product) {
            return { error: "Sản phẩm không tồn tại" };
        }

        await product.destroy();
        return { success: true };
    } catch (error) {
        console.log("Lỗi deleteProductService: ", error);
        return null;
    }
};

// Lấy tất cả categories
const getCategoriesService = async () => {
    try {
        const categories = await Category.findAll({
            order: [['name', 'ASC']]
        });
        return categories;
    } catch (error) {
        console.log("Lỗi getCategoriesService: ", error);
        return null;
    }
};

module.exports = {
    getProductsService,
    getProductByIdService,
    createProductService,
    updateProductService,
    deleteProductService,
    getCategoriesService
};
