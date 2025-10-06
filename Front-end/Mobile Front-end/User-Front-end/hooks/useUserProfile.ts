import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile } from '../services/userApi';

// Key cho cache React Query
const USER_PROFILE_QUERY_KEY = ['userProfile'];

// Hook lấy profile user
export function useUserProfile() {
    const query = useQuery({
        queryKey: USER_PROFILE_QUERY_KEY,
        queryFn: getUserProfile,
    });
    return query;
}

// Hook cập nhật profile user
export function useUpdateUserProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateUserProfile,
        onSuccess: () => {
            // Tự động refetch lại profile sau khi cập nhật thành công
            queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
        },
    });
}

// Cách sử dụng trong component:
// const { data, isLoading, error } = useUserProfile();
// const updateProfile = useUpdateUserProfile();
