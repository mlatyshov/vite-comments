export interface Author {
  id: number;
  name: string;
  avatar: string;
}

export interface Data {
  id: number;
  created: string;
  text: string;
  author: number;
  parent: null | number;
  likes: number;
}

export interface IPagination {
  pagination: {
    page: number;
    size: number;
    total_pages: number;
  };
  data: Data[];
}
