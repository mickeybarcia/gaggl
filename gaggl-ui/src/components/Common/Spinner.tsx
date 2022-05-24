import React from 'react';

type Props = {
  isLoading: boolean;
};

const Spinner: React.FC<Props> = ({ isLoading }) => {
  return (
    <div>
      {isLoading && (
        <div className="d-flex justify-content-center">
          <span className="spinner-border spinner-border-lg"></span>
        </div>
      )}
    </div>
  );
};

export default Spinner;
