export interface ErrorDetailDeleteReason {
  id: string;
  label: string;
}

export interface ErrorDetails {
  id: string;
  code: string;
  deleted: boolean;
  comment: string | null;
  type: string;
  title: string;
  category: string;
  geste_id?: string | null;
  problem?: string | null;
  solution?: string | null;
  provided_value?: string | null;
}
