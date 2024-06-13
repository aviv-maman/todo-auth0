export interface TodoData {
  [key: string]: {
    created_at: number;
    updated_at: number;
    title: string;
    content: string;
    status: boolean;
    owner_id: string | null;
    owner_email: string | null;
    owner_name: string | null;
    owner_picture: string | null;
  };
}
