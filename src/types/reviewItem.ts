import { Timestamp } from "firebase/firestore";

export interface UserReview {
    userId: string;
    stallID: string;
    comment: string;
    rating: number;
    userName: string;
    time: Timestamp;
}

export type Review = {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  timestamp: Timestamp;
};
/* 
1. reviews page: button to write review 
2. reviews page: display reviews (display users review first)
3. user page: display reviews
4. update stall rating -- DONE
5. update database -- DONE

*/


