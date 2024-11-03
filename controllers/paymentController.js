const {Payment} = require("../models/model");
const request = require('request');
const moment = require('moment');


function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

const paymentController = {
    addPayment: async(req, res) => {
        try {
            const newPayment = new Payment(req.body);
            const savedPayment = await newPayment.save();
            res.status(200).json(savedPayment);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAllPayment: async(req, res) => {
        try {
            const allPayment = await Payment.find();
            res.status(200).json(allPayment);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getPayment: async(req, res) => {
        try {
            const payment = await Payment.findById(req.params.id);
            res.status(200).json(payment);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updatePayment: async(req, res) => {
        try {
            const payment = await Payment.findById(req.params.id);
            await payment.updateOne({$set : req.body});
            res.status(200).json("Updated succesfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deletePayment: async (req, res) => {
        try {

            await Payment.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    paymentVNP: (req, res) => {
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');
        
        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let config = require('config');
        
        let tmnCode = config.get('vnp_TmnCode');
        let secretKey = config.get('vnp_HashSecret');
        let vnpUrl = config.get('vnp_Url');
        let returnUrl = config.get('vnp_ReturnUrl');
        // let orderId = moment(date).format('DDHHmmss');
        let orderId = req.body.orderID;
        let amount = req.body.amount;
        let bankCode = req.body.bankCode;
        
        let locale = req.body.language;
        if(locale === null || locale === ''){
            locale = 'vn';
        }
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if(bankCode !== null && bankCode !== ''){
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");     
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        // res.redirect(vnpUrl)
        res.send(vnpUrl);

    },
    refundVNP: (req, res) =>{
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        let date = new Date();
    
        let config = require('config');
        let crypto = require("crypto");
       
        let vnp_TmnCode = config.get('vnp_TmnCode');
        let secretKey = config.get('vnp_HashSecret');
        let vnp_Api = config.get('vnp_Api');
        
        let vnp_TxnRef = req.body.orderID;
        let vnp_TransactionDate = req.body.transDate;
        let vnp_Amount = req.body.amount *100;
        let vnp_TransactionType = req.body.transType;
        let vnp_CreateBy = req.body.user;
                
        let currCode = 'VND';
        
        let vnp_RequestId = moment(date).format('HHmmss');
        let vnp_Version = '2.1.0';
        let vnp_Command = 'refund';
        let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;
                
        let vnp_IpAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    
        
        let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
        
        let vnp_TransactionNo = '0';
        
        let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|" + vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
        let hmac = crypto.createHmac("sha512", secretKey);
        let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");
        
         let dataObj = {
            'vnp_RequestId': vnp_RequestId,
            'vnp_Version': vnp_Version,
            'vnp_Command': vnp_Command,
            'vnp_TmnCode': vnp_TmnCode,
            'vnp_TransactionType': vnp_TransactionType,
            'vnp_TxnRef': vnp_TxnRef,
            'vnp_Amount': vnp_Amount,
            'vnp_TransactionNo': vnp_TransactionNo,
            'vnp_CreateBy': vnp_CreateBy,
            'vnp_OrderInfo': vnp_OrderInfo,
            'vnp_TransactionDate': vnp_TransactionDate,
            'vnp_CreateDate': vnp_CreateDate,
            'vnp_IpAddr': vnp_IpAddr,
            'vnp_SecureHash': vnp_SecureHash
        };
        
        request({
            url: vnp_Api,
            method: "POST",
            json: true,   
            body: dataObj
                }, function (error, response, body){
                    console.log(response);
                });
        
    }

}
module.exports = paymentController;