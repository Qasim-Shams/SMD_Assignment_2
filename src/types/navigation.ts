export type RootStackParamList = {
  ServiceSelect: undefined;
  LocationSelect: { service: string };
  Offers: { service: string; location: string };
  Confirmation: { service: string; location: string; offer: string };
};

export type MainTabParamList = {
  Services: undefined;
  Bookings: undefined;
};
