
const Product = require('../models/Product');
const multer = require('multer');
const Firm = require('../models/Firm');

 const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // store in 'uploads/' folder
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + path.extname(file.originalname) + Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

const addProduct = async(req,res)=>{
    try {
        const { productName, price, category,  bestSeller, description } = req.body;

        const image = req.file? req.file.filename: undefined;// Assuming you're using multer for file uploads

        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if(!firm){
            return res.status(404).json({error:"Firm not found"});
        }

        const newProduct = new Product({
            productName,
            price,
            category,
            image,
            bestSeller,
            description,
            firm: firm._id
        });
        
       const savedProduct = await newProduct.save();
       firm.products.push(savedProduct);
       await firm.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getProductByFirm = async(req,res)=>{
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId).populate('products');
        if(!firm){
            return res.status(404).json({error:"Firm not found"});
        }
        const resturantName = firm.firmname;
        const products = await Product.find({firm:firmId})
        res.status(200).json({resturantName, products});
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const deleteProductById = async(req,res)=>{
    try {
        const productId = req.params.productId;
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if(!deletedProduct){
            return res.status(404).json({error:"Product not found"});
        }
        
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {addProduct:[upload.single('image'), addProduct], getProductByFirm, deleteProductById};