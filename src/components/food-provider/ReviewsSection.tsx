
import React from 'react';
import { Users } from 'lucide-react';
import { Review } from '@/types/food';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';

interface ReviewsSectionProps {
  providerId: string;
  reviews: Review[];
  onSubmitReview: (rating: number, comment: string) => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ providerId, reviews, onSubmitReview }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
        
        {reviews.length > 0 ? (
          <div>
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/10 rounded-lg">
            <Users className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p>No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
      
      <div className="md:col-span-1">
        <ReviewForm 
          providerId={providerId} 
          onSubmit={onSubmitReview}
        />
      </div>
    </div>
  );
};

export default ReviewsSection;
