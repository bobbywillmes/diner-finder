class Api::ReviewsController < ApplicationController
  skip_before_action :verify_authenticity_token
  def create
    token = cookies.signed[:diner_session_token]
    session = Session.find_by(token: token)
    return render json: {message: 'not authorized'} if !session
    user_id = session.user.id
    user = User.find_by(id: user_id)
    business = Business.find_by(id: params[:id])
    business_id = params[:id]

    @review = Review.new(review_params)
    @review.business = business
    @review.user = user

    if @review.save
      render 'api/reviews/showOne', status: :created
    else
      puts '@review.save ELSE --------'
      return render json: {err: @review.errors, error: 'unable to upload review :('}
    end
  end

  def show
    @business = Business.find_by(id: params[:id])
    @reviews = Review.where(business_id: @business.id).order(created_at: :desc)
    return render json: {message: 'no reviews', reviews: []}, status: :ok if @reviews.length == 0
    render 'api/reviews/show', status: :ok
  end

  def delete
    token = cookies.signed[:diner_session_token]
    session = Session.find_by(token: token)
    user = User.find_by(id: session.user_id)

    return render json: { success: false, message: 'User not logged in.' }, status: 401 unless session

    review = Review.find_by(id: params[:id])
    if review.destroy
      render json: {
        success: true,
        message: 'Review deleted'
      }, status: 200
    else
      puts 'review.destroy ELSE -----'
      render json: {
        success: false
      }, status: 400
    end
  end

  def review_params
    params
      .require(:review)
      .permit(:text, :rating, :user_id, :business_id, :business, :user, :image, :images)
  end
  def image_params
    params
      .require(:images)
      .permit(:description, :category, :user_id, :business_id, :business, :user)
  end
end
