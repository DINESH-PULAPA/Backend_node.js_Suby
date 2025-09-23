const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv');

dotenv.config();

const secretKey = process.env.JWT_SECRET;


const vendorRegister = async(req,res) =>{
    const{username,email,password} = req.body;
    try{
        const vendorEmail = await Vendor.findOne({email});
        if(vendorEmail){
            return res.status(400).json("Email already exists");
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const newVendor = new Vendor({
            username,
            email,
            password:hashedPassword
        });
        await newVendor.save();
        res.status(200).json({msg:"Vendor registered successfully"});
        console.log('registered')

    }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }

}

const vendorLogin = async(req,res)=>{
    const {email,password} = req.body;
    try{
    const foundVendor = await Vendor.findOne({email});
        if(!foundVendor || !(await bcrypt.compare(password, foundVendor.password))){
            return res.status(400).json({error:"Invalid  username or password credentials"});
        }
        const token = jwt.sign({vendorId:foundVendor._id}, secretKey,{expiresIn:'1h'})

        const vendorId = foundVendor._id;

        res.status(200).json({msg:"vendor logged in successfully", token, vendorId});
        console.log(email,"this is token", token);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
}


const getAllVendors = async(req,res)=>{
    try{
        const vendors = await Vendor.find().populate('firm');  //to display the firm details along with vendor using (populate)
        res.json({vendors});
    } catch(error){
        console.log(error);
        res.status(500).json({error:"internal server error"});
    }
}

const getVendorById = async(req,res)=>{
    const vendorId = req.params.id;   //params ==>endpoint of the url ex:localhost:5000/vendor/all-vendors  (all-vendors is the params)

    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if(!vendor){
            return res.status(404).json({error:"Vendor not found"});
        }

        const vendorFirmId = vendor.firm && vendor.firm.length > 0 ? vendor.firm[0]._id : null;

        res.status(200).json({vendor,vendorId, vendorFirmId});
        console.log(vendor,vendorId, vendorFirmId);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"internal server error"});
    }
}
module.exports = {vendorRegister,vendorLogin,getAllVendors,getVendorById};