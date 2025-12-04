const db = require('../../models');
const Product = db.Product;
const Category = db.Category;
const Fuse = require('fuse.js');

// Lấy tất cả sản phẩm với pagination, filter theo category và fuzzy search
const getProductsService = async (page = 1, limit = 10, categoryId = null, searchQuery = null) => {
    try {
        const offset = (page - 1) * limit;
        
        const whereClause = categoryId ? { categoryId: parseInt(categoryId) } : {};
        
        // Lấy tất cả sản phẩm (không phân trang) nếu có search query để fuzzy search
        let allProducts;
        if (searchQuery) {
            allProducts = await Product.findAll({
                where: whereClause,
                include: [{
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                }],
                order: [['createdAt', 'DESC']]
            });
        } else {
            // Nếu không có search, dùng pagination như cũ
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
        }

        // Nếu có search query, sử dụng fuzzy search
        if (searchQuery && allProducts.length > 0) {
            const fuseOptions = {
                keys: [
                    { name: 'name', weight: 0.7 },
                    { name: 'description', weight: 0.3 }
                ],
                threshold: 0.4, // lower threshold for more fuzzy search
                includeScore: true,
                minMatchCharLength: 1
            };

            const fuse = new Fuse(allProducts, fuseOptions);
            const searchResults = fuse.search(searchQuery);

            // Lấy kết quả đã được sắp xếp theo độ tương đồng
            const matchedProducts = searchResults.map(result => result.item);
            const totalMatched = matchedProducts.length;

            // Áp dụng pagination cho kết quả search
            const paginatedProducts = matchedProducts.slice(offset, offset + parseInt(limit));

            return {
                products: paginatedProducts,
                totalProducts: totalMatched,
                totalPages: Math.ceil(totalMatched / limit),
                currentPage: parseInt(page)
            };
        }

        // Nếu có search nhưng không có kết quả
        if (searchQuery) {
            return {
                products: [],
                totalProducts: 0,
                totalPages: 0,
                currentPage: parseInt(page)
            };
        }

        return {
            products: allProducts,
            totalProducts: allProducts.length,
            totalPages: Math.ceil(allProducts.length / limit),
            currentPage: parseInt(page)
        };
    } catch (error) {
        console.error("Lỗi getProductsService: ", error);
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
