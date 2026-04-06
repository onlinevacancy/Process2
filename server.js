// index.js

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

// Create uploads folder if it doesn't exist
const uploadPath = "./uploads";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const app = express();
app.use(express.json());
app.use(cors());

// Multer setup - only allow image uploads
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"), false);
    }
  }
});

// Simple memory database
let users = {
  1: { balance: 0 }
};
let payments = [];

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ GET UPI / QR
app.get("/api/getUpi", (req, res) => {
  res.json({
    status: true,
    upiId: "headoffice9@ybl",   // 👈 CHANGE THIS IF NEEDED
    qrCode: "https://via.placeholder.com/200",
    qrCodeId: "QR123"
  });
});

// ✅ ADD FUND
app.post("/api/addFund", upload.single("screenshot"), (req, res) => {
  const { amount, transactionId, upiId } = req.body;

  if (!amount || !transactionId) {
    return res.json({ status: false, message: "Missing data" });
  }

  payments.push({
    userId: 1,
    amount,
    transactionId,
    upiId,
    screenshot: req.file ? req.file.path : null,
    status: "pending"
  });

  res.json({
    status: true,
    message: "Payment submitted"
  });
});

// ✅ CHECK BALANCE
app.get("/api/balance", (req, res) => {
  res.json({
    balance: users[1].balance
  });
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
