import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import SessionService from './session';

const baseURL = process.env.REACT_APP_API_URL;
const authPath = '/auth';
const headers = { 'Content-Type': 'application/json' };

const instance = axios.create({ baseURL, headers });

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = SessionService.getToken();
    if (token && config.headers) {
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const { config: originalConfig } = err;
    if (originalConfig.url !== authPath + '/signIn' && err.response) {
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const refreshToken = SessionService.getRefreshToken();
          if (refreshToken) {
            const { data: session } = await refreshTokens(refreshToken);
            SessionService.saveSessionTokens(session);
          }
          return instance(originalConfig);
        } catch (_err) {
          SessionService.removeSession();
          // TODO - REDIRECT
          return Promise.reject(_err);
        }
      }
    }
    return Promise.reject(err);
  }
);

const refreshTokens = async (refreshToken: string): Promise<AxiosResponse<Tokens>> => {
  return instance.post(authPath + '/refreshtoken', { refreshToken });
};

const signUp = async (signUpRequest: SignUpRequest): Promise<AxiosResponse<Session>> => {
  return instance.post(authPath + '/signUp', signUpRequest);
};

const signIn = async (email: string, password: string): Promise<AxiosResponse<Session>> => {
  return instance.post(authPath + '/signIn', { email, password });
};

const signOut = async () => instance.post(authPath + '/signOut');

const getCurrentUser = async (): Promise<AxiosResponse<User>> => {
  return instance.get('/users');
};

const getProspects = async (
  searchRequest: SearchRequest
): Promise<AxiosResponse<ProspectResults>> => {
  return instance.post('/search', searchRequest);
};

const getMatches = async (): Promise<AxiosResponse<MatchResults>> => {
  return instance.get('/matches');
};

const getMatch = async (matchId: string): Promise<AxiosResponse<Match>> => {
  return instance.get('/matches/' + matchId);
};

const getProfilePic = async (userId: string): Promise<AxiosResponse<Blob>> => {
  return instance.get('/users/profile/pic/' + userId, { responseType: 'blob' });
};

const saveProfilePic = async (file: any): Promise<AxiosResponse<Blob>> => {
  const formData = new FormData();
  formData.append('page', file);
  return instance.post('/users/profile/pic/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

const likeUser = async (likeeId: string): Promise<AxiosResponse<ProspectResults>> => {
  return instance.post('/likes/like', { likee: likeeId });
};

const disLikeUser = async (likeeId: string): Promise<AxiosResponse<ProspectResults>> => {
  return instance.post('/likes/dislike', { likee: likeeId });
};

const addTag = async (tag: string): Promise<AxiosResponse<User>> => {
  return instance.post('/users/tags/' + tag);
};

const removeTag = async (tag: string): Promise<AxiosResponse<User>> => {
  return instance.delete('/users/tags/' + tag);
};

const GagglApi = {
  signUp,
  signIn,
  signOut,
  getProspects,
  getCurrentUser,
  likeUser,
  disLikeUser,
  getMatches,
  getMatch,
  addTag,
  removeTag,
  getProfilePic,
  saveProfilePic
};

export default GagglApi;
