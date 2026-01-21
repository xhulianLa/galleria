export type Exhibit = {
  exhibit_id: number;
  title: string;
  date_display: string;
  culture: string;
  type: string;
  technique: string;
  measurements: string;
  tombstone: string;
  description: string | null;
  artist: string;
  department: string;
  collection: string;
  url: string;
  image_url: string;
};

export type AppState = {
  isSearching: boolean;
};
