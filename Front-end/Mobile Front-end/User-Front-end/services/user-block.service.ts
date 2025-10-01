import { httpService } from "./http.service";
import {
  IUser,
  ApiResponse,
  PaginatedResponse,
  UserQueryParams,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types/user";
import { IProfile } from "@/types/profile"; // Assuming this exists
import {
  IUserBlock,
  BlockQueryParams,
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

export default new UserBlockService();
