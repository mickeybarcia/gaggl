import React, { useEffect, useState } from 'react';

const Test: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => undefined, []);

  return <div>Test</div>;
};

export default Test;
