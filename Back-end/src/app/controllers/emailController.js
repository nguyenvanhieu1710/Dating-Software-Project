const emailService = require("../../services/emailService");

class EmailController {
  async sendToAllUsers(req, res) {
    try {
      const { subject, htmlContent } = req.body;

      // Validation
      if (!subject || !subject.trim()) {
        return res.status(400).json({
          success: false,
          message: "Subject is required",
        });
      }

      if (!htmlContent || !htmlContent.trim()) {
        return res.status(400).json({
          success: false,
          message: "Email content is required",
        });
      }

      const result = await emailService.sendEmailToAllUsers(
        subject,
        htmlContent
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Send email to all error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to send emails",
      });
    }
  }

  async sendToSpecificUsers(req, res) {
    try {
      const { email, subject, htmlContent } = req.body;

      // Validation
      if (!email || !email.trim()) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      if (!subject || !subject.trim()) {
        return res.status(400).json({
          success: false,
          message: "Subject is required",
        });
      }

      if (!htmlContent || !htmlContent.trim()) {
        return res.status(400).json({
          success: false,
          message: "Email content is required",
        });
      }

      const result = await emailService.sendEmailToSpecificUsers(
        email,
        subject,
        htmlContent
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Send email to specific users error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to send emails",
      });
    }
  }
}

module.exports = new EmailController();
