interface User {
  name: string;
  age: number;
  profile?: Profile;
  tags: string[];
  id: string;
}

interface ProspectUser {
  name: string;
  age: number;
  profile?: Profile;
  tags: string[];
  id: string;
}

interface Profile {
  description?: string;
}

interface ProspectResult {
  user: ProspectUser;
  matchCount: number;
}

type ProspectResults = {
  results: Prospect[];
};

interface SearchRequest {
  location: UserLocation;
  tags: string[];
  distance: number;
}

interface MatchResults {
  results: Match[];
}

interface Match {
  id: number;
  date: string;
  user: ProspectUser;
}

interface UserLocation {
  lat: number;
  lon: number;
}

type Session = {
  user: User;
  token: string;
  refreshToken: string;
};

type Tokens = {
  token: string;
  refreshToken: string;
};

type SignUpRequest = {
  name: string;
  age: number;
  email: string;
  password: string;
  location: UserLocation;
  tags: string[];
};

type SearchRequest = {
  tags: string[];
  location: UserLocation;
  distance: number;
};
