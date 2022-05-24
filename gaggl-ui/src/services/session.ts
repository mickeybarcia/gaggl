const SESSION_STORE_KEY = 'session';
const SEARCH_PREFERENCES_STORE_KEY = 'preferences';

const getSession = (): Session | null => {
  const sessionStr = localStorage.getItem(SESSION_STORE_KEY);
  return sessionStr ? JSON.parse(sessionStr) : null;
};

const getCurrentUser = (): User | null => {
  const session = getSession();
  return session ? session.user : null;
};

const getRefreshToken = (): string | null => {
  const session = getSession();
  return session ? session.refreshToken : null;
};

const getToken = (): string | null => {
  const session = getSession();
  return session ? session.token : null;
};

const saveSession = (session: Session) => {
  localStorage.setItem(SESSION_STORE_KEY, JSON.stringify(session));
};

const saveSessionTokens = (tokens: Tokens) => {
  const session = getSession();
  if (session) {
    session.token = tokens.token;
    session.refreshToken = tokens.refreshToken;
    localStorage.setItem(SESSION_STORE_KEY, JSON.stringify(session));
  }
};

const removeSession = () => {
  localStorage.removeItem(SESSION_STORE_KEY);
  localStorage.removeItem(SEARCH_PREFERENCES_STORE_KEY);
};

const saveSearchPreferences = (tags: string[]) => {
  localStorage.setItem(SEARCH_PREFERENCES_STORE_KEY, JSON.stringify(tags));
};

const getSearchPreferences = (): string[] | null => {
  const tagsStr = localStorage.getItem(SEARCH_PREFERENCES_STORE_KEY);
  return tagsStr ? JSON.parse(tagsStr) : null;
};

const SessionService = {
  getCurrentUser,
  getRefreshToken,
  getToken,
  saveSession,
  saveSessionTokens,
  removeSession,
  saveSearchPreferences,
  getSearchPreferences
};

export default SessionService;
