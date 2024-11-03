const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const moment = require('moment');
const request = require('request');

const productRoute = require("./routes/product")
const vendorRoute = require("./routes/vendor")
const categoryRoute = require("./routes/category")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
const chatRoute = require("./routes/chat")
const imgProductRoute = require("./routes/imgProduct")
const paymentRoute = require("./routes/payment")
const commentRoute = require("./routes/comment")
const repCommentRoute = require("./routes/repComment")
const userRoute = require("./routes/user")
const customerRoute = require("./routes/customer")
const locationRoute = require("./routes/location")
const authRoute = require("./routes/auth")
const warehouseRoute = require("./routes/warehouse")
const statisticalRoute = require("./routes/statistical")
const reviewRoute = require("./routes/review")
const contactRoute = require("./routes/contact")
const productDetailRoute = require("./routes/productDetail")
const productPriceRoute = require("./routes/productPrice")
const requestBuild = require("./routes/requestBuild")
const voucherRoute = require("./routes/voucher");
const refundRoute = require("./routes/refund");

const { sendMail } = require("./controllers/mail");


const app = express();
dotenv.config();
app.use(bodyParser.json({ limit: "50mb" })); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({origin:'*'}));

const dbUrl = process.env.MONGODB_URL;
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected Successfully'))
.catch(err => console.error('Error:', err));

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/vendors", vendorRoute);
app.use("/api/categorys", categoryRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/users", userRoute);
app.use("/api/customers", customerRoute);
app.use("/api/imgProducts", imgProductRoute);
app.use("/api/comments", commentRoute);
app.use("/api/repComments", repCommentRoute);
app.use("/api/chats", chatRoute);
app.use("/api/locations", locationRoute);
app.use("/api/warehouses", warehouseRoute);
app.use("/api/statisticals", statisticalRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/contacts", contactRoute);
app.use("/api/productDetails", productDetailRoute);
app.use("/api/productPrices", productPriceRoute);
app.use("/api/requestBuilds", requestBuild);
app.use("/api/vouchers", voucherRoute);
app.use("/api/refunds", refundRoute);

app.listen(8000, ()=>{
    // sendMail("tranwuocnam@gmail.com","Hello world!","Title","<b>Chao</b>");
    console.log("Server is running...");
})

// function sortObject(obj) {
// 	let sorted = {};
// 	let str = [];
// 	let key;
// 	for (key in obj){
// 		if (obj.hasOwnProperty(key)) {
// 		str.push(encodeURIComponent(key));
// 		}
// 	}
// 	str.sort();
//     for (key = 0; key < str.length; key++) {
//         sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
//     }
//     return sorted;
// }

// app.post('/create_payment_url', function (req, res, next) {
    
//     process.env.TZ = 'Asia/Ho_Chi_Minh';
    
//     let date = new Date();
//     let createDate = moment(date).format('YYYYMMDDHHmmss');
    
//     let ipAddr = req.headers['x-forwarded-for'] ||
//         req.connection.remoteAddress ||
//         req.socket.remoteAddress ||
//         req.connection.socket.remoteAddress;

//     let config = require('config');
    
//     let tmnCode = config.get('vnp_TmnCode');
//     let secretKey = config.get('vnp_HashSecret');
//     let vnpUrl = config.get('vnp_Url');
//     let returnUrl = config.get('vnp_ReturnUrl');
//     let orderId = moment(date).format('DDHHmmss');
//     let amount = req.body.amount;
//     let bankCode = req.body.bankCode;
    
//     let locale = req.body.language;
//     if(locale === null || locale === ''){
//         locale = 'vn';
//     }
//     let currCode = 'VND';
//     let vnp_Params = {};
//     vnp_Params['vnp_Version'] = '2.1.0';
//     vnp_Params['vnp_Command'] = 'pay';
//     vnp_Params['vnp_TmnCode'] = tmnCode;
//     vnp_Params['vnp_Locale'] = locale;
//     vnp_Params['vnp_CurrCode'] = currCode;
//     vnp_Params['vnp_TxnRef'] = orderId;
//     vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
//     vnp_Params['vnp_OrderType'] = 'other';
//     vnp_Params['vnp_Amount'] = amount * 100;
//     vnp_Params['vnp_ReturnUrl'] = returnUrl;
//     vnp_Params['vnp_IpAddr'] = ipAddr;
//     vnp_Params['vnp_CreateDate'] = createDate;
//     if(bankCode !== null && bankCode !== ''){
//         vnp_Params['vnp_BankCode'] = bankCode;
//     }

//     vnp_Params = sortObject(vnp_Params);

//     let querystring = require('qs');
//     let signData = querystring.stringify(vnp_Params, { encode: false });
//     let crypto = require("crypto");     
//     let hmac = crypto.createHmac("sha512", secretKey);
//     let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
//     vnp_Params['vnp_SecureHash'] = signed;
//     vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

//     // res.redirect(vnpUrl)
//     res.send(vnpUrl);
// });
