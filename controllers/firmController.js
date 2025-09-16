const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path');

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
  try {
    // Debug logs
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("VENDOR ID:", req.vendorId);

    const { firmname, area, category, region, offer } = req.body;
    const image = req.file ? req.file.filename : undefined;

    // Check for vendorId
    if (!req.vendorId) {
      return res.status(401).json({ error: "Unauthorized: vendorId missing" });
    }

    const vendor = await Vendor.findById(req.vendorId);

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
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
    vendor.firm.push(savedFirm._id);
    await vendor.save();
    return res.status(201).json({ message: "Firm added successfully", firm: savedFirm });

  } catch (error) {
    console.error("Error adding firm:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const deletedFirm = await Firm.findByIdAndDelete(firmId);

    if (!deletedFirm) {
      return res.status(404).json({ error: "Firm not found" });
    }
    res.status(200).json({ message: "Firm deleted successfully" });
  } catch (error) {
    console.error("Error deleting firm:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Export with multer middleware
module.exports = { addFirm: [upload.single('file'), addFirm], deleteFirmById };