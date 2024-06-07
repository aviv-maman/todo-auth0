export interface TodoData {
  [key: string]: {
    created_at: number;
    updated_at: number;
    title: string;
    content: string;
    status: boolean;
  };
}
