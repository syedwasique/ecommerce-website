import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authcontext';
import styles from './review.module.css';

const Review = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReviewData, setEditReviewData] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5000/api/product/${productId}/reviews`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.status}`);
        }
        
        const data = await response.json();
        const reviewsData = Array.isArray(data) ? data : (data.reviews || []);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);

    try {
      const token = await currentUser.getIdToken();
      
      const response = await fetch(`http://localhost:5000/api/product/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: Number(newReview.rating),
          comment: newReview.comment.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const result = await response.json();
      setReviews(prev => [...prev, result]);
      setNewReview({ rating: 5, comment: '' });
      setSuccess('Review submitted successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setEditReviewData({
      rating: review.rating,
      comment: review.comment
    });
  };

  const handleUpdateReview = async (reviewId) => {
    try {
      setSubmitLoading(true);
      setError(null);
      
      const token = await currentUser.getIdToken();
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: Number(editReviewData.rating),
          comment: editReviewData.comment.trim(),
          userId: currentUser.uid
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update review');
      }

      const updatedReview = await response.json();
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? updatedReview : review
      ));
      setEditingReviewId(null);
      setSuccess('Review updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      setSubmitLoading(true);
      setError(null);
      
      const token = await currentUser.getIdToken();
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: currentUser.uid
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      setReviews(prev => prev.filter(review => review.id !== reviewId));
      setSuccess('Review deleted successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingReviewId(null);
    setEditReviewData({ rating: 5, comment: '' });
  };

  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;
  const roundedRating = Math.round(averageRating);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className={styles.reviewContainer}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        &larr; Back to Product
      </button>

      <h1 className={styles.reviewTitle}>Customer Reviews</h1>
      
      <div className={styles.reviewStats}>
        <div className={styles.averageRating}>
          <span className={styles.ratingNumber}>
            {averageRating.toFixed(1)}
          </span>
          <div className={styles.stars}>
            {'★'.repeat(roundedRating)}
            {'☆'.repeat(5 - roundedRating)}
          </div>
          <span className={styles.totalReviews}>
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      </div>

      {currentUser && (
        <form 
          onSubmit={editingReviewId ? (e) => {
            e.preventDefault();
            handleUpdateReview(editingReviewId);
          } : handleSubmitReview} 
          className={styles.reviewForm}
        >
          <h3>{editingReviewId ? 'Edit Your Review' : 'Write a Review'}</h3>
          
          {error && (
            <div className={styles.errorMessage}>
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          {success && (
            <div className={styles.successMessage}>
              <i className="fas fa-check-circle"></i> {success}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="rating">Rating:</label>
            <select
              id="rating"
              value={editingReviewId ? editReviewData.rating : newReview.rating}
              onChange={(e) => editingReviewId 
                ? setEditReviewData({...editReviewData, rating: e.target.value})
                : setNewReview({...newReview, rating: e.target.value})}
              required
              disabled={submitLoading}
            >
              <option value="5">5 ★ (Excellent)</option>
              <option value="4">4 ★ (Very Good)</option>
              <option value="3">3 ★ (Good)</option>
              <option value="2">2 ★ (Fair)</option>
              <option value="1">1 ★ (Poor)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="comment">Your Review (minimum 10 characters):</label>
            <textarea
              id="comment"
              value={editingReviewId ? editReviewData.comment : newReview.comment}
              onChange={(e) => editingReviewId
                ? setEditReviewData({...editReviewData, comment: e.target.value})
                : setNewReview({...newReview, comment: e.target.value})}
              placeholder="Share your honest thoughts about this product..."
              rows="5"
              minLength="10"
              required
              disabled={submitLoading}
            />
          </div>

          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={submitLoading || 
                (editingReviewId 
                  ? !editReviewData.comment.trim() || editReviewData.comment.trim().length < 10
                  : !newReview.comment.trim() || newReview.comment.trim().length < 10)}
            >
              {submitLoading ? (
                <>
                  <span className={styles.spinner}></span> {editingReviewId ? 'Updating...' : 'Submitting...'}
                </>
              ) : (editingReviewId ? 'Update Review' : 'Submit Review')}
            </button>
            
            {editingReviewId && (
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={cancelEdit}
                disabled={submitLoading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div className={styles.reviewsList}>
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <div className={styles.userInfo}>
                  <div className={styles.avatar}>
                    {review.user_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className={styles.userName}>
                    {review.user_name || 'Anonymous'}
                  </span>
                </div>
                <div className={styles.reviewRating}>
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </div>
              </div>
              <div className={styles.reviewContent}>
                <p>{review.comment}</p>
              </div>
              <div className={styles.reviewFooter}>
                <div className={styles.reviewDate}>
                  {new Date(review.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  {review.updated_at && review.updated_at !== review.created_at && (
                    <span className={styles.editedLabel}> (edited)</span>
                  )}
                </div>
                
                {currentUser && currentUser.uid === review.user_id && (
                  <div className={styles.reviewActions}>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEditReview(review)}
                      disabled={submitLoading}
                    >
                      Edit
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteReview(review.id)}
                      disabled={submitLoading}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noReviews}>No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default Review;