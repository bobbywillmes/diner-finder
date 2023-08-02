class Api::ImagesController < ApplicationController
  skip_before_action :verify_authenticity_token
  def create
    token = cookies.signed[:diner_session_token]
    session = Session.find_by(token: token)
    user_id = session.user.id
    user = User.find_by(id: user_id)
    business = Business.find_by(id: params[:id])
    business_id = params[:id]
    review = Review.find_by(id: params[:image][:review_id])

    @image = Image.new(image_params)
    @image.business = business
    @image.user = user
    @image.review = review

    if @image.save
      render 'api/images/show', status: :created
    else
      render json: {err: @image.errors, error: 'unable to upload image :('}
    end
  end

  def update
    token = cookies.signed[:diner_session_token]
    session = Session.find_by(token: token)
    user_id = session.user_id
    @user = User.find_by(id: user_id)

    @image = Image.find_by(id: params[:id])

    return render json: {message: 'not authorized'}, status: :forbidden if @image.user_id != @user.id

    return render 'not_found', status: :not_found if not @image
    return render 'bad_request', status: :bad_request if not @image.update(image_params)
    render 'api/images/update', status: :ok
  end

  def delete
    token = cookies.signed[:diner_session_token]
    session = Session.find_by(token: token)
    user = User.find_by(id: session.user_id)

    return render json: { success: false, message: 'User not logged in.' }, status: 401 unless session

    image = Image.find_by(id: params[:id])
    if image.destroy
      render json: {
        success: true,
        message: 'Image successfully deleted.'
      }
    else
      render json: {
        success: false,
        message: 'Something went wrong....'
      }
    end

  end


  def show
    @images = Image.all
    render 'api/images/show'
  end

  def find
    @images = Image.where(business_id: params[:id])
    render 'api/images/show'
  end

  def image_params
    params
      .require(:image)
      .permit(:description, :category, :image, :images, :user_id, :business_id, :business, :user, :review_id)
  end
end
