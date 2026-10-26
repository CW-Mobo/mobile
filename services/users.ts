import api from '../config/api';

export type UserProfile = {
  userName?: string;
  userEmail?: string;
  userImage?: string;
  userRole?: 'family_farmer' | 'company_admin' | 'company_worker';
  company?: string;
};

export async function fetchCurrentUser(): Promise<UserProfile> {
  const response = await api.get<{ user: UserProfile }>('/users/me');
  return response.data.user;
}
