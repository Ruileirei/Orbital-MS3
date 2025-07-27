import { Review } from "../types/reviewItem";

export function calculateRatingSpread(reviews: Review[] = []): number[] {
    const counts = [0, 0, 0, 0, 0]; 
    for (const review of reviews) {
        const r = review.rating || 0; 
        const idx = 5 - r; 
        if (idx >= 0 && idx < 5) {
            counts[idx] += 1;
        }
    }
    return counts;
}