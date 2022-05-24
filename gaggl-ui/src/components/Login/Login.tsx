import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

import { useAuth } from '../../auth';
import { TEST_LOGIN } from '../../config.json';
import { Spinner, ErrorBanner } from '../Common';

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();

  const from = location.state?.from.pathname || '/search';

  const initialValues =
    process.env.REACT_APP_ENV_NAME == 'dev'
      ? { email: TEST_LOGIN.email, password: TEST_LOGIN.password }
      : { email: '', password: '' };
  const validationSchema = Yup.object().shape({
    email: Yup.string().required(),
    password: Yup.string().required()
  });

  const handleLogin = async (formValue: { email: string; password: string }) => {
    const { email, password } = formValue;
    setMessage('');
    setLoading(true);
    try {
      await auth.signIn(email, password, () => navigate(from, { replace: true }));
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        const apiError = error as AxiosError;
        if (apiError.response?.status === 401) {
          setMessage('email or password invalid');
          return;
        }
      }
      setMessage('something went wrong.. please refresh the page');
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="col-md-4 card card-container">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}>
          <Form className="m-5">
            <div className="form-group">
              <label htmlFor="email">email: </label>
              <Field name="email" type="text" className="form-control" />
              <ErrorMessage name="email" component="div" className="alert alert-danger" />
            </div>

            <div className="form-group">
              <label htmlFor="password">password: </label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="alert alert-danger" />
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-dark btn-block" disabled={loading}>
                <Spinner isLoading={loading} />
                <span>login</span>
              </button>
            </div>
            <ErrorBanner message={message} />
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Login;
