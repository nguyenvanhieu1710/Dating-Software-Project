const { createTransporter } = require("../config/email.config");
const UserModel = require("../app/models/userModel");
const userModel = new UserModel();

class EmailService {
  async getAllUserEmails() {
    try {
      const users = await userModel.findAllWithProfile();
      return users;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  async sendEmail(to, subject, htmlContent, userName = "") {
    const transporter = createTransporter();

    try {
      const personalizedContent = htmlContent.replace(
        /\{\{name\}\}/g,
        userName
      );

      const info = await transporter.sendMail({
        from: `"${process.env.APP_NAME}" <${process.env.SMTP_USER}>`,
        to: to,
        subject: subject,
        html: personalizedContent,
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async sendEmailToAllUsers(subject, htmlContent) {
    try {
      const users = await this.getAllUserEmails();

      if (users.length === 0) {
        return {
          success: true,
          message: "No users found",
          total: 0,
          successful: 0,
          failed: 0,
        };
      }

      const emailPromises = users.map((user) =>
        this.sendEmail(
          user.email,
          subject,
          htmlContent,
          user.first_name || user.name || ""
        )
      );

      const results = await Promise.allSettled(emailPromises);

      const successful = results.filter(
        (r) => r.status === "fulfilled" && r.value.success
      ).length;
      const failed = results.filter(
        (r) => r.status === "rejected" || !r.value.success
      ).length;

      return {
        success: true,
        message: `Sent to ${successful} users, ${failed} failed`,
        total: users.length,
        successful,
        failed,
      };
    } catch (error) {
      throw new Error(`Failed to send emails: ${error.message}`);
    }
  }

  async sendEmailToSpecificUsers(email, subject, htmlContent) {
    try {
      const result = await this.sendEmail(email, subject, htmlContent, "");

      return {
        success: result.success,
        message: result.success ? "Email sent successfully" : "Email failed",
        total: 1,
        successful: result.success ? 1 : 0,
        failed: result.success ? 0 : 1,
      };
    } catch (error) {
      throw new Error(`Failed to send emails: ${error.message}`);
    }
  }
}

module.exports = new EmailService();
