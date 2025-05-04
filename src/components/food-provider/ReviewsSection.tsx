
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Review } from '@/types/food';

interface ReviewsSectionProps {
  providerId: string;
  reviews: Review[];
  onSubmitReview: (rating: number, comment: string) => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ 
  providerId, 
  reviews,
  onSubmitReview
}) => {
  const { user } = usePiAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    onSubmitReview(rating, comment.trim());
    setComment('');
    setRating(5);
    setIsSubmitting(false);
  };
  
  return (
    <div className="space-y-6">
      {user && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Write a Review</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <span className="mr-2">Your Rating:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={`h-5 w-5 ${value <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full resize-none"
                  rows={3}
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={!comment.trim() || isSubmitting}
              >
                Submit Review
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
      
      <div>
        <h3 className="font-semibold mb-4">Customer Reviews ({reviews.length})</h3>
        
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>
                          {review.userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{review.userName}</div>
                        <div className="flex items-center">
                          <div className="flex mr-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
