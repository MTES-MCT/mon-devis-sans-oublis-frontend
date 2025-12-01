export type Rating = 0 | 1 | 2 | 3 | 4 | 5;

export interface Feedbacks {
  id: string;
  quote_check_id: string;
  comment: string;
  email: string | null;
  rating: Rating;
}

export interface FeedbackResponse {
  id?: string;
  comment: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface GlobalFeedbackData {
  comment: string;
  email: string | null;
  rating: Rating;
}
