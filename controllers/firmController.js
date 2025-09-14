const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require ('multer');
// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
// const dotenv = require('dotenv');
const path = require('path');


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

const addFirm = async(req,res)=>{
   try {
     const {firmname, area, category,region,offer} = req.body;

    const image = req.file? req.file.filename: undefined// Assuming you're using multer for file uploads

    const vendor = await Vendor.findById(req.vendorId);

    if(!vendor){
        return res.status(404).json({error:"Vendor not found"});
    }

    const firm = new Firm({
        firmname,
        area,
        category,
        region,
        offer,
        image,
        vendor: vendor._id
    });


   const savedFirm = await firm.save();
   vendor.firm.push(savedFirm);
    await vendor.save();
    return res.status(201).json({message:"Firm added successfully"});
    
   } catch (error) {
       console.error("Error adding firm:", error);
       res.status(500).json({ error: "Internal server error" });
   }
}

const deleteFirmById = async(req,res)=>{
    try {
        const firmId = req.params.firmId;
        const deletedFirm = await Firm.findByIdAndDelete(firmId);

        if(!deletedFirm){
            return res.status(404).json({error:"Firm not found"});
        }
        
    } catch (error) {
        console.error("Error deleting firm:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {addFirm:[upload.single('image'), addFirm], deleteFirmById };