import { apiClient } from './apiClient';

export interface Match {
    id: number;
    user1_id: number;
    user2_id: number;
    created_at: string;
    updated_at: string;
    status: 'active' | 'unmatch';
    user1_name?: string;
    user1_email?: string;
    user1_avatar?: string;
    user2_name?: string;
    user2_email?: string;
    user2_avatar?: string;
    message_count?: number;
    last_message_at?: string;
    report_count?: number;
    report_reason?: string;
}

export interface MatchFilters {
    status?: string;
    search?: string;
    sort_by?: 'created_at' | 'last_message' | 'message_count' | 'status' | 'report_count';
    sort_order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface MatchStats {
    total_matches: number;
    active_matches: number;
    reported_matches: number;
    blocked_matches: number;
    avg_messages_per_match: number;
    matches_today: number;
    matches_this_week: number;
    matches_this_month: number;
}

export interface CreateMatchData {
    user1_id: number;
    user2_id: number;
    status?: 'active' | 'unmatch';
}

export interface UpdateMatchData {
    status?: 'active' | 'unmatch';
    report_reason?: string;
}

class AdminMatchService {
    private baseUrl = '/match';

    /**
     * Get all matches with filtering and pagination
     */
    async getMatches(filters: MatchFilters = {}): Promise<{
        matches: Match[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        try {
            const params = new URLSearchParams();
            
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, value.toString());
                }
            });

            const response = await apiClient.get<any>(`${this.baseUrl}?${params.toString()}`);

            // Transform the response to match expected structure
            if (response?.success && response?.data) {
                return {
                    matches: response.data,
                    total: response.pagination?.total || response.data.length,
                    page: response.pagination?.page || 1,
                    limit: response.pagination?.limit || 10,
                    totalPages: response.pagination?.totalPages || 1,
                };
            }

            // Fallback for other response structures
            return {
                matches: response?.matches || response?.data || [],
                total: response?.total || response?.pagination?.total || 0,
                page: response?.page || response?.pagination?.page || 1,
                limit: response?.limit || response?.pagination?.limit || 10,
                totalPages: response?.totalPages || response?.pagination?.totalPages || 1,
            };
        } catch (error) {
            console.error('Error fetching matches:', error);
            // Fallback to regular match endpoints
            return this.getMatchesFromRegularEndpoint(filters);
        }
    }

    /**
     * Fallback method to get matches from regular endpoints
     */
    private async getMatchesFromRegularEndpoint(filters: MatchFilters = {}): Promise<{
        matches: Match[];
                total: number;
                page: number;
                limit: number;
        totalPages: number;
    }> {
        try {
            // First get all users to map user info
            const usersResponse = await apiClient.get<{ users: any[] }>('/user');
            const users = usersResponse.users || [];
            
            // Get matches from regular endpoint
            const response = await apiClient.get<{ data: any[] }>('/api/match');
            let matches = response.data || [];
            
            // Enhance match data with user information
            matches = matches.map((match: any) => {
                const user1 = users.find((u: any) => u.id === match.user1_id);
                const user2 = users.find((u: any) => u.id === match.user2_id);
                return {
                    ...match,
                    user1_name: user1 ? `${user1.first_name} ${user1.last_name}` : 'Unknown User',
                    user1_email: user1 ? user1.email : 'unknown@email.com',
                    user1_avatar: user1?.photos?.[0] || undefined,
                    user2_name: user2 ? `${user2.first_name} ${user2.last_name}` : 'Unknown User',
                    user2_email: user2 ? user2.email : 'unknown@email.com',
                    user2_avatar: user2?.photos?.[0] || undefined,
                    message_count: 0, // Default since not in backend
                    last_message_at: match.updated_at,
                    report_count: 0,
                };
            });

            // Apply filters
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                matches = matches.filter((match: Match) =>
                    match.user1_name?.toLowerCase().includes(searchLower) ||
                    match.user2_name?.toLowerCase().includes(searchLower) ||
                    match.user1_email?.toLowerCase().includes(searchLower) ||
                    match.user2_email?.toLowerCase().includes(searchLower) ||
                    match.id.toString().includes(searchLower)
                );
            }

            if (filters.status && filters.status !== 'all') {
                matches = matches.filter((match: Match) => match.status === filters.status);
            }

            // Apply sorting
            if (filters.sort_by) {
                matches.sort((a: any, b: any) => {
                    let aValue = a[filters.sort_by!];
                    let bValue = b[filters.sort_by!];
                    
                    if (filters.sort_by === 'message_count' || filters.sort_by === 'report_count') {
                        aValue = parseInt(aValue) || 0;
                        bValue = parseInt(bValue) || 0;
                    } else if (filters.sort_by?.includes('date') || filters.sort_by === 'last_message') {
                        aValue = new Date(aValue);
                        bValue = new Date(bValue);
                    }
                    
                    if (filters.sort_order === 'asc') {
                        return aValue > bValue ? 1 : -1;
                    } else {
                        return aValue < bValue ? 1 : -1;
                    }
                });
            }

            // Apply pagination
            const page = filters.page || 1;
            const limit = filters.limit || 10;
            const total = matches.length;
            const totalPages = Math.ceil(total / limit);
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            
            matches = matches.slice(startIndex, endIndex);

            return {
                matches,
                total,
                page,
                limit,
                totalPages
            };
        } catch (error) {
            console.error('Error in fallback match fetch:', error);
            throw error;
        }
    }

    /**
     * Get a single match by ID
     */
    async getMatchById(id: number): Promise<Match> {
        try {
            const response = await apiClient.get<{ data: Match }>(`${this.baseUrl}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching match ${id}:`, error);
            // Fallback to regular endpoint
            const response = await apiClient.get<{ data: Match }>(`/api/match/${id}`);
            return response.data;
        }
    }

    /**
     * Create a new match
     */
    async createMatch(matchData: CreateMatchData): Promise<Match> {
        try {
            const response = await apiClient.post<{ data: Match }>(this.baseUrl, matchData);
            return response.data;
        } catch (error) {
            console.error('Error creating match:', error);
            // Fallback to regular endpoint
            const response = await apiClient.post<{ data: Match }>('/api/match', matchData);
            return response.data;
        }
    }

    /**
     * Update an existing match
     */
    async updateMatch(id: number, updateData: UpdateMatchData): Promise<Match> {
        try {
            const response = await apiClient.put<{ data: Match }>(`${this.baseUrl}/${id}`, updateData);
            return response.data;
        } catch (error) {
            console.error(`Error updating match ${id}:`, error);
            // Fallback to regular endpoint
            const response = await apiClient.put<{ data: Match }>(`/api/match/${id}`, updateData);
            return response.data;
        }
    }

    /**
     * Delete a match
     */
    async deleteMatch(id: number): Promise<boolean> {
        try {
            await apiClient.delete(`${this.baseUrl}/${id}`);
            return true;
        } catch (error) {
            console.error(`Error deleting match ${id}:`, error);
            // Fallback to regular endpoint
            await apiClient.delete(`/api/match/${id}`);
            return true;
        }
    }

    /**
     * Get match statistics
     */
    async getMatchStats(): Promise<MatchStats> {
        try {
            const response = await apiClient.get<{ data: MatchStats }>(`${this.baseUrl}/stats`);
            return response.data;
        } catch (error) {
            console.error('Error fetching match stats:', error);
            // Fallback to regular endpoint
            const response = await apiClient.get<{ data: any[] }>('/api/match/stats');
            const stats = response.data || [];
            
            // Process stats data
            const processed = {
                total_matches: 0,
                active_matches: 0,
                reported_matches: 0,
                blocked_matches: 0,
                avg_messages_per_match: 0,
                matches_today: 0,
                matches_this_week: 0,
                matches_this_month: 0,
            };

            stats.forEach((stat: any) => {
                processed.total_matches += stat.count;
                
                if (stat.status === 'active') {
                    processed.active_matches += stat.count;
                } else if (stat.status === 'reported') {
                    processed.reported_matches += stat.count;
                } else if (stat.status === 'blocked') {
                    processed.blocked_matches += stat.count;
                }
            });

            return processed;
        }
    }
}

export const adminMatchService = new AdminMatchService();
