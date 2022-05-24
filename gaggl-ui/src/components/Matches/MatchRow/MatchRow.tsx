import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GagglApi from '../../../services/gaggl-api';
import { Spinner } from '../../Common';

type Props = {
  match: Match;
};

const MatchRow: React.FC<Props> = ({ match }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [proPicUrl, setProPicUrl] = useState<string>('https://via.placeholder.com/50x50');
  const navigate = useNavigate();

  const { user } = match;

  const downloadProPic = async () => {
    setLoading(true);
    try {
      const { data } = await GagglApi.getProfilePic(user.id);
      const reader = new FileReader();
      reader.readAsDataURL(data);
      reader.onloadend = () => {
        const base64data = reader.result;
        setProPicUrl(String(base64data));
        setLoading(false);
      };
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    downloadProPic();
  }, []);

  return (
    <div className="m-5" onClick={() => navigate(`/matches/${match.id}`)}>
      <div className="card card-container">
        <span className="d-flex container align-items-center">
          <div style={{ height: '50px', width: '50px' }}>
            <Spinner isLoading={loading} />
            {!loading && (
              <img
                style={{ width: '100%', height: '50px', objectFit: 'contain' }}
                src={proPicUrl}
              />
            )}
          </div>
          <div className="m-2 w-100">
            <div className="d-flex container mb-1 justify-content-between">
              <div>{user.name}</div>
              <div>{user.age} yrs</div>
            </div>
            <div className="d-flex container">
              {user.tags.map((tag: string) => (
                <mark key={tag} className="m-1 bg-warning">
                  {tag}
                </mark>
              ))}
            </div>
          </div>
        </span>
      </div>
    </div>
  );
};

export default MatchRow;
