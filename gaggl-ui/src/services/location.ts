const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, error) => navigator.geolocation.getCurrentPosition(resolve, error));
};

const LocationService = {
  getCurrentPosition
};

export default LocationService;
