import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import GagglApi from '../../services/gaggl-api';
import ProspectCard from '../Search/ProspectCard';
import FilterSearch from '../Search/SearchBar/FilterSearch';
import { ErrorBanner, Spinner } from '../Common';

const Profile: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [user, setUser] = useState<User>();
  const [file, setFile] = useState<any>();

  const handleAddTag = async (tag: string) => {
    if (!user?.tags.includes(tag)) {
      try {
        setLoading(true);
        const { data: user } = await GagglApi.addTag(tag);
        setUser(user);
      } catch (error) {
        console.log(error);
        setMessage('something went wrong.. please refresh the page');
      }
      setLoading(false);
    }
  };

  const handleRemoveTag = async (tag: string) => {
    try {
      setLoading(true);
      const { data: user } = await GagglApi.removeTag(tag);
      setUser(user);
    } catch (error) {
      console.log(error);
      setMessage('something went wrong.. please refresh the page');
    }
    setLoading(false);
  };

  const getCurrentUser = async () => {
    try {
      setLoading(true);
      const { data: user } = await GagglApi.getCurrentUser();
      setUser(user);
    } catch (error) {
      console.log(error);
      setMessage('something went wrong.. please refresh the page');
    }
    setLoading(false);
  };

  const imageValidation = Yup.object().shape({
    file: Yup.mixed().required()
  });

  const handleSaveFile = async () => {
    if (file) {
      try {
        await GagglApi.saveProfilePic(file);
      } catch (error) {
        console.log(error);
        setMessage('unable to save file.. try another');
      }
      await getCurrentUser();
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    handleSaveFile();
  }, [file]);

  return (
    <div>
      <Spinner isLoading={loading} />
      <ErrorBanner message={message} />
      {!message && user && !loading && (
        <div>
          <div className="container col-md-5 justify-content-center">
            <ProspectCard user={user} />
          </div>
          <div className="fixed-top mt-5">
            <div className="m-5 col-md-3 card card-container">
              <FilterSearch
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
                tags={user.tags}
              />
              <br />
              <Formik
                initialValues={{ file: null }}
                onSubmit={handleSaveFile}
                validationSchema={imageValidation}>
                {(formik) => (
                  <Form>
                    <div className="form-group mt-2">
                      <label htmlFor="file">pro pic:</label>
                      <input
                        name="file"
                        type="file"
                        className="form-control"
                        onChange={(event: any) => {
                          const file = event.currentTarget.files[0];
                          setFile(file);
                        }}
                      />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
