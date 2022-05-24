import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import GagglApi from '../../../services/gaggl-api';
import { Spinner } from '../../Common';
import MatchRow from '../MatchRow';

type MatchParams = {
  matchId: string;
};

const Match: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [match, setMatch] = useState<Match>();
  const { matchId } = useParams<keyof MatchParams>() as MatchParams;

  useEffect(() => {
    fetchMatch();
  }, []);

  const fetchMatch = async () => {
    try {
      setLoading(true);
      const { data: match } = await GagglApi.getMatch(matchId);
      setMatch(match);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="container col-md-5 justify-content-center">
      <Spinner isLoading={loading} />
      {match && <MatchRow key={match.user.id} match={match} />}
      CHATS GO HERE
    </div>
  );
};

export default Match;
