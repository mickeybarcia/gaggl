import React from 'react';

type Props = {
  message?: string;
};

const ErrorBanner: React.FC<Props> = ({ message }) => {
  return (
    <div>
      {message && (
        <div className="form-group">
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorBanner;
