import asyncHandler from "../middleware/asyncHandler.js"
import Product from '../models/productModel.js';

//@desc Fetch all products
// @route GET api/products
//@access Public
const getProducts = asyncHandler (async (req,res) => {
    const products = await Product.find({});
    res.json(products);
})

//@desc Fetch product by ID
// @route GET api/products/:id
//@access Public
const getProductById =  asyncHandler(async (req,res) => {
    const product = await Product.findById(req.params.id);

    if (product){
        return res.json(product);    
    } else {
        res.status(404);
        throw new Error ('Resource not found');
    }
})

//@desc Create a new product 
// @route POST api/products/
//@access Private/Admin
const createNewProduct =  asyncHandler(async (req,res) => {
  const product = new Product({
    name: 'Sample product',
    price: 0,
    user: req.user._id,
    image: '/image/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description'
  });
   
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
})

//@desc Update product by ID
// @route PUT api/products/:id
//@access Private/admin
const updateProduct =  asyncHandler(async (req,res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product){
      product.name = name;
      product.price = price;    
      product.description = description;    
      product.image = image;    
      product.brand = brand;    
      product.category = category;  
      product.countInStock = countInStock;
      
      const updateProduct = await product.save();
      res.json(updateProduct);
  } else {
      res.status(404);
      throw new Error ('Resource not found');
  }
})

//@desc Delete product by ID
// @route DELETE api/products/:id
//@access Private/admin
const deleteProduct =  asyncHandler(async (req,res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
      await product.deleteOne({ _id: product._id });
      res.status(200).json({ message: 'Product removed' });
  } else {
      res.status(404);
      throw new Error ('Resource not found');
  }
})

export { getProducts, getProductById, createNewProduct, updateProduct, deleteProduct };