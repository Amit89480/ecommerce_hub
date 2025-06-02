require("dotenv").config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILID,
    pass: process.env.MAILPASSWORD,
  },
});
module.exports = {
  email: async ({ to, subject, text }) => {
    await transporter.sendMail({
      from: '"Your Shop" <no-reply@yourshop.com>',
      to,
      subject,
      text,
    });
  },

  sendOrderConfirmationEmail: async ({
    to,
    fullName,
    orderId,
    totalAmount,
    paymentMethod,
    detailedInventory,
    address,
    city,
    state,
    zipCode,
  }) => {
    const productList = detailedInventory
      .map((item) => `ID: ${item.inventory}, Qty: ${item.quantity}`)
      .join("\n");

    const emailBody = `Hi ${fullName},\n\nYour order (${orderId}) has been placed successfully.\n\nOrder Details:\nTotal Amount: ₹${totalAmount}\nPayment Method: ${paymentMethod}\n\nProducts:\n${productList}\n\nShipping Address:\n${address}, ${city}, ${state}, ${zipCode}\n\nThank you for shopping with us!`;

    await module.exports.email({
      to,
      subject: "Order Confirmation",
      text: emailBody,
    });
  },

  sendOrderDeclinedEmail: async ({ to, fullName, failedItemId }) => {
    const emailBody = `Hi ${fullName},\n\nUnfortunately, your order could not be completed.\nItem ID: ${failedItemId} is out of stock or unavailable.\nPlease try again or contact our support team for assistance.\n\nThank you for understanding.`;

    await module.exports.email({
      to,
      subject: "Order Declined",
      text: emailBody,
    });
  },
};
