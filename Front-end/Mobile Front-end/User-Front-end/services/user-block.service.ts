import { httpService } from "./http.service";
import {
  IUserBlock,
  ApiResponse,
  CreateBlockRequest,
} from "@/types/user-block";

class UserBlockService {
  private readonly basePath = "/user";

  /**
   * Block a user
   */
  async blockUser(
    blockData: CreateBlockRequest
  ): Promise<ApiResponse<IUserBlock>> {
    return httpService.post<ApiResponse<IUserBlock>>(
      `${this.basePath}/blocks`,
      blockData
    );
  }

  /**
   * Unblock a user
   */
  async unblockUser(blockedId: number): Promise<ApiResponse<void>> {
    return httpService.delete<ApiResponse<void>>(
      `${this.basePath}/blocks/${blockedId}`
    );
  }
}

export const userBlockService = new UserBlockService();
