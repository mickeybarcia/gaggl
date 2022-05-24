import React, { useEffect, useState } from 'react';
import GagglApi from '../../../services/gaggl-api';
import { Spinner } from '../../Common';

type Props = {
  user: ProspectUser;
  onLikeUser?: (likeeId: string) => void;
  onDisLikeUser?: (likeeId: string) => void;
};

const ProspectCard: React.FC<Props> = ({ user, onDisLikeUser, onLikeUser }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [proPicUrl, setProPicUrl] = useState<string>('https://via.placeholder.com/250x250');

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

  const handleLikeUser = async () => {
    if (onLikeUser) onLikeUser(user.id);
  };

  const handleDisLikeUser = async () => {
    if (onDisLikeUser) onDisLikeUser(user.id);
  };

  return (
    <div className="m-5">
      <div className="card card-container">
        <div className="d-flex justify-content-center position-relative bg-light">
          <div className="d-flex align-items-center" style={{ height: '350px' }}>
            <Spinner isLoading={loading} />
          </div>
          {!loading && (
            <img style={{ width: '100%', height: '350px', objectFit: 'contain' }} src={proPicUrl} />
          )}
          {(onLikeUser || onDisLikeUser) && (
            <div className="position-absolute fixed-bottom m-2">
              {onLikeUser && <img onClick={handleLikeUser} className="mr-2" src="/check.png" />}
              {onDisLikeUser && <img onClick={handleDisLikeUser} src="/cancel.png" />}
            </div>
          )}
        </div>
        <div className="m-2">
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
      </div>
    </div>
  );
};

export default ProspectCard;
