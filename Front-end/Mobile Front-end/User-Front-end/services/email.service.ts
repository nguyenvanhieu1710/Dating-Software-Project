import { httpService } from "./http.service";
import { IEmailSendRequest, IEmailSendResponse, ApiResponse } from "@/types/email";

class EmailService {
  private readonly basePath = "/email";

  /**
   * Send email to all users
   */
  async sendEmailToAllUsers(
    data: IEmailSendRequest
  ): Promise<ApiResponse<IEmailSendResponse>> {
    return httpService.post<ApiResponse<IEmailSendResponse>>(
      `${this.basePath}/send-all`,
      data
    );
  }

  /**
   * Send email to specific users
   */
  async sendEmailToSpecificUsers(
    data: IEmailSendRequest & { email: string }
  ): Promise<ApiResponse<IEmailSendResponse>> {
    return httpService.post<ApiResponse<IEmailSendResponse>>(
      `${this.basePath}/send-specific`,
      data
    );
  }

  /**
   * Validate email send data
   */
  validateEmailData(data: IEmailSendRequest & { email?: string }): string[] {
    const errors: string[] = [];

    if (!data.subject || !data.subject.trim()) {
      errors.push("Subject is required");
    }

    if (!data.htmlContent || !data.htmlContent.trim()) {
      errors.push("Email content is required");
    }

    if (data.email && !this.validateEmail(data.email)) {
      errors.push("Invalid email format");
    }

    return errors;
  }

  /**
   * Validate email format
   */
  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}

// Export singleton instance
export const emailService = new EmailService();