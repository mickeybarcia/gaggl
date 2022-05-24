import React, { useEffect, useState } from 'react';

import GagglApi from '../../services/gaggl-api';
import LocationService from '../../services/location';
import SessionService from '../../services/session';
import ProspectCard from './ProspectCard';
import SearchBar from './SearchBar';
import { ErrorBanner, Spinner } from '../Common';

type Props = any;

const Search: React.FC<Props> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [tags, setTags] = useState<string[]>(['anime', 'skating', 'cats']);
  const [distance, setDistance] = useState<number>(200);
  const [prospects, setProspects] = useState<ProspectResult[]>([]);
  const [location, setLocation] = useState<UserLocation | null>(null);

  const handleAddTag = async (tag: string) => {
    if (!tags.includes(tag)) {
      const newTags = [tag, ...tags];
      setTags(newTags);
      SessionService.saveSearchPreferences(newTags);
    }
    window.scrollTo(0, 0);
  };

  const handleRemoveTag = async (tag: string) => {
    const index = tags.indexOf(tag);
    tags.splice(index, 1);
    const newTags = [...tags];
    setTags(newTags);
    SessionService.saveSearchPreferences(newTags);
    window.scrollTo(0, 0);
  };

  const handleChangeDistance = async (_distance: number) => {
    if (distance !== _distance) setDistance(_distance);
    window.scrollTo(0, 0);
  };

  const handleLikeUser = async (likeeId: string) => {
    await GagglApi.likeUser(likeeId);
    const rmUserIndex = prospects.findIndex(({ user: { id } }) => id === likeeId);
    prospects.splice(rmUserIndex, 1);
    setProspects([...prospects]);
  };

  const handleDisLikeUser = async (likeeId: string) => {
    await GagglApi.disLikeUser(likeeId);
    const rmUserIndex = prospects.findIndex(({ user: { id } }) => id === likeeId);
    prospects.splice(rmUserIndex, 1);
    setProspects([...prospects]);
  };

  const getLocation = async () => {
    setLoading(true);
    if (process.env.REACT_APP_ENV_NAME == 'dev') {
      setLocation({ lat: 46.12, lon: -71.34 });
    } else {
      try {
        const location = await LocationService.getCurrentPosition();
        const {
          coords: { latitude: lat, longitude: lon }
        } = location;
        setLocation({ lat, lon });
      } catch (error) {
        console.log(error);
        setMessage('something went wrong.. please check you have location services enabled');
      }
    }
    setLoading(false);
  };

  const fetchProspects = async () => {
    if (location) {
      try {
        setLoading(true);
        const searchRequest: SearchRequest = { distance, tags, location };
        const {
          data: { results }
        } = await GagglApi.getProspects(searchRequest);
        setProspects(results);
      } catch (error) {
        console.log(error);
        setMessage('something went wrong.. please refresh the page');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProspects();
  }, [location, tags, distance]);

  useEffect(() => {
    const savedTags = SessionService.getSearchPreferences();
    if (savedTags) setTags(savedTags);
    getLocation();
  }, []);

  return (
    <div>
      {!message && (
        <div className="fixed-top mt-5">
          <SearchBar
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            onChangeDistance={handleChangeDistance}
            distance={distance}
            tags={tags}
          />
        </div>
      )}
      <div className="container col-md-5 justify-content-center">
        <Spinner isLoading={loading} />
        <ErrorBanner message={message} />
        {!loading &&
          prospects.map(({ user }) => (
            <ProspectCard
              key={user.id}
              user={user}
              onLikeUser={handleLikeUser}
              onDisLikeUser={handleDisLikeUser}
            />
          ))}
      </div>
    </div>
  );
};

export default Search;
