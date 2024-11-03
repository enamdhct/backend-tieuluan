const nodemailer = require('nodemailer');
require('dotenv').config();
// Step 1: Create a transporter
console.log({ user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS });

const transporter = nodemailer.createTransport({
  service: 'gmail', // or specify your email service provider here
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // For Gmail, you might need an app-specific password if 2FA is enabled
  },
});

const mailService = {
  sendMail: async (to, title, text, content,idOrder,type="default",address) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,       // Sender address
        to: to,  // List of recipients
        subject: title,      // Subject line
        text: text, // Plain text body
        html: type =="default" ? mailService.generateContent(content,idOrder,address): mailService.generateContentBuild(content) // HTML body
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    } catch (err) {
      console.log({ err });
    }
  },
  generateContent: (data,link="",address) => {
    console.log({ data });
    let totalPrice = 0
    return `<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border: 1px solid #dddddd;">
      
      ${address ? `<h5 style="text-align: center; color: red;">${address}</h5>` :""}
      <h2 style="text-align: center; color: #333;">Thông Tin Đơn Hàng <a href=http://localhost:3000/order/detail/${link}>Tại đây</a></h2>
      <!-- Loop qua các sản phẩm -->
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <th style="text-align: left; padding: 10px; border-bottom: 1px solid #dddddd;">Hình ảnh</th>
          <th style="text-align: left; padding: 10px; border-bottom: 1px solid #dddddd;">Tên sản phẩm</th>
          <th style="text-align: center; padding: 10px; border-bottom: 1px solid #dddddd;">Số lượng</th>
          <th style="text-align: right; padding: 10px; border-bottom: 1px solid #dddddd;">Giá</th>
          <th style="text-align: right; padding: 10px; border-bottom: 1px solid #dddddd;">Tổng giá</th>
        </tr>

        <!-- Bắt đầu sản phẩm -->
        ${data.product.map(product => {
          totalPrice += product?.totalPrice
      return ` <tr>
          <td style="padding: 10px;">
            <img src=${product.imgProduct} alt="Z790" style="width: 80px; height: auto;">
          </td>
          <td style="padding: 10px; color: #333;">${product?.name}</td>
          <td style="padding: 10px; text-align: center; color: #333;">${product?.quantity}</td>
          <td style="padding: 10px; text-align: right; color: #333;">${product?.price.toLocaleString('vi-VN')} VND</td>
          <td 
       style="padding: 10px; text-align: right; color: #333;">${product?.totalPrice.toLocaleString('vi-VN')} VND</td>
        </tr>`
    })}

        <!-- Kết thúc sản phẩm -->

      </table>
      <div style="margin-top: 20px; text-align: right;">
        <p style="font-weight: bold; color: #333;">Phí ship: ${data?.shippingFee.toLocaleString('vi-VN')} VND</p>
      </div>
      ${data?.voucherPrice ? `<div style="margin-top: 20px; text-align: right;">
        <p style="font-weight: bold; color: #333;">Voucher: -${data?.voucherPrice.toLocaleString('vi-VN')} VND</p>
      </div>` : "" }
        ${data?.coinApply ? `<div style="margin-top: 20px; text-align: right;">
        <p style="font-weight: bold; color: #333;">Coin apply: -${data?.coinApply.toLocaleString('vi-VN')} VND</p>
      </div>` : "" }
      <div style="margin-top: 20px; text-align: right;">
        <p style="font-weight: bold; color: #333;">Tổng tiền: ${data?.Price.toLocaleString('vi-VN')} VND</p>
      </div>

      <p style="text-align: center; color: #777; font-size: 12px;">Cảm ơn bạn đã mua hàng tại PC Shop!</p>
    </div>
  </body>
</html>
`
  },
  generateContentBuild: (data,link="") => {
    console.log({ data });
    let totalPrice = 0
    return `<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border: 1px solid #dddddd;">
      <h2 style="text-align: center; color: #333;">Thông Tin Yêu Cầu</h2>

      <!-- Loop qua các sản phẩm -->
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <th style="text-align: left; padding: 10px; border-bottom: 1px solid #dddddd;">Hình ảnh</th>
          <th style="text-align: left; padding: 10px; border-bottom: 1px solid #dddddd;">Tên sản phẩm</th>
          <th style="text-align: center; padding: 10px; border-bottom: 1px solid #dddddd;">Số lượng</th>
          <th style="text-align: right; padding: 10px; border-bottom: 1px solid #dddddd;">Giá</th>
          <th style="text-align: right; padding: 10px; border-bottom: 1px solid #dddddd;">Tổng giá</th>
        </tr>

        <!-- Bắt đầu sản phẩm -->
        ${data.product.map(product => {
          totalPrice += product?.totalPrice
      return ` <tr>
          <td style="padding: 10px;">
            <img src=${product.imgProduct} alt="Z790" style="width: 80px; height: auto;">
          </td>
          <td style="padding: 10px; color: #333;">${product?.name}</td>
          <td style="padding: 10px; text-align: center; color: #333;">${product?.quantity}</td>
          <td style="padding: 10px; text-align: right; color: #333;">${product?.price.toLocaleString('vi-VN')} VND</td>
          <td 
       style="padding: 10px; text-align: right; color: #333;">${product?.totalPrice.toLocaleString('vi-VN')} VND</td>
        </tr>`
    })}

        <!-- Kết thúc sản phẩm -->

      </table>
      <div style="margin-top: 20px; text-align: right;">
        <p style="font-weight: bold; color: #333;">Tổng tiền: ${data?.Price.toLocaleString('vi-VN')} VND</p>
      </div>

      <p style="text-align: center; color: #777; font-size: 12px;">Cảm ơn bạn đã mua hàng tại PC Shop!</p>
    </div>
  </body>
</html>
`
  }
}
module.exports = mailService;