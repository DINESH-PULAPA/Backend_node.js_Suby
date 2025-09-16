const express = require ('express')
const dotenv = require ('dotenv')
const mongoose = require ('mongoose')
const bodyParser = require ('body-parser')
const vendorRoutes = require('./routes/vendorRoutes')
const firmRoutes = require('./routes/firmRoutes')
const productRoutes = require('./routes/productRoutes');
const path = require('path');
const cors = require('cors');

const app = express()


const PORT = process.env.PORT || 5000

app.use(cors());
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(()=>
    console.log("db connected successfully")
)
.catch((err)=>
    console.log("error in db connection", err))


app.use(bodyParser.json());
app.use('/vendor',vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the 'uploads' directory



app.listen(PORT,()=>{
    console.log(`server is running on port localhost ${PORT}`);
})  

app.use('/', (req, res) => {
    res.json({ message: "Welcome to Suby" });
});
