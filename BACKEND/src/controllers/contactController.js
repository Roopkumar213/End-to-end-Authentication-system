// backend/controllers/contactController.js
const { sendContactEmail } = require("../utils/email");

exports.handleContact = async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ message: "name, email, message are required" });
    }

    await sendContactEmail({ name, email, message });

    return res.status(200).json({
      success: true,
      message: "Contact submitted successfully",
      data: {
        name,
        email,
        message,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("handleContact error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send contact email",
    });
  }
};
