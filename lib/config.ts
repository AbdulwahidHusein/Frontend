export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/accounts/login/`,
  REGISTER: `${API_BASE_URL}/api/accounts/register/`,
  PROFILE: `${API_BASE_URL}/api/accounts/profile/`,
  JOBS: `${API_BASE_URL}/api/jobs`,
  LISTINGS: `${API_BASE_URL}/api/listings/`,
  BOOKMARK: `${API_BASE_URL}/api/jobs/bookmark/`,
  LIKE: `${API_BASE_URL}/api/jobs/like/`,
  BEST_MATCHES: `${API_BASE_URL}/api/jobs/best-matches/`,
}; 