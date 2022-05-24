import React, { useEffect, useState } from 'react';
import GagglApi from '../../services/gaggl-api';
import { ErrorBanner, Spinner } from '../Common';
import MatchRow from './MatchRow';

type Props = any;

const Matches: React.FC<Props> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setMessage('');
      setLoading(true);
      const {
        data: { results: matches }
      } = await GagglApi.getMatches();
      setMatches(matches);
    } catch (error) {
      console.log(error);
      setMessage('something went wrong.. Please refresh the page');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="container col-md-5 justify-content-center">
        <Spinner isLoading={loading} />
        {matches.map((match) => (
          <MatchRow key={match.user.id} match={match} />
        ))}
        <ErrorBanner message={message} />
      </div>
    </div>
  );
};

export default Matches;
