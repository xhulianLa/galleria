export type Exhibit = {
  id: number;
  title: string;
  creation_date_display?: string;
  creation_year_earliest?: number;
  department?: string;
  object_type?: string;
  technique?: string;
  culture?: string;
  description?: string;
  image_web_url: string;
  url: string;
  artist_names?: string;
};

export type AppState = {
  isSearching: boolean;
};
