export interface IGeoJson {
  type: string;
  coordinates: Array<number>;
}

export interface IGeoJsonLocation extends IGeoJson {
  formattedAddress?: string;
  street?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
}

export interface ICoordinates {
  latitude: number;
  longitude: number;
}
