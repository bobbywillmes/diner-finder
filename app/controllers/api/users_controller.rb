class Api::UsersController < ApplicationController
  skip_before_action :verify_authenticity_token
    def create
      @user = User.new(user_params)
      if @user.save
        render 'api/users/create', status: :created
      else
        render json: { success: false, status: :bad_request, error: @user.errors }
      end
    end

    def details
      @user = User.find(params[:id])
      @images = Image.where(user_id: @user.id).where('images.review_id' => nil).order(created_at: :desc) # (images that don't belong to a review)
      @reviews = Review.where(user_id: @user.id).order(created_at: :desc)
      @imageCount = Image.where(user_id: @user.id).count
      @reviewCount = Review.where(user_id: @user.id).count
      render 'api/users/details'
    end

    private

    def user_params
      params
        .require(:user)
        .permit(:email, :name, :password, :location, :businessAccount, :adminAccount)
        .with_defaults(businessAccount: false, adminAccount: false)
    end
end
