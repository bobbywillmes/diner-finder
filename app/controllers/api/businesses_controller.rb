class Api::BusinessesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @businesses = Business.order(created_at: :asc).page(params[:page]).per(10)
    # @businesses = Business.order(Arel.sql('RANDOM()')).page(params[:page]).per(10)
    return render json: { error: 'not_found' }, status: :not_found if !@businesses
    render 'api/businesses/index', status: :ok
  end

  def show
    @business = Business.find_by(id: params[:id])
    @images = Image.where(business_id: params[:id])
    @reviews = Review.where(business_id: params[:id]).order(created_at: :desc)
    return render json: { error: 'not_found' }, status: :not_found if !@business
    render 'api/businesses/show', status: :ok
  end

  def create
    token = cookies.signed[:diner_session_token]
    session = Session.find_by(token: token)
    user = session.user

    @business = user.businesses.new(business_params)

    if @business.save
      render 'api/businesses/show', status: :created
    else
      render json: { success: false, status: :bad_request, error: @business.errors }
    end
  end

  def update
    token = cookies.signed[:diner_session_token]
    session = Session.find_by(token: token)
    user = session.user

    @business = Business.find_by(id: params[:id])

    return render json: {message: 'not authorized'}, status: :forbidden if @business.user_id != user.id

    return render 'not_found', status: :not_found if not @business
    return render 'bad_request', status: :bad_request if not @business.update(business_params)
    render 'show', status: :ok
  end

  def destroy
    @business = Business.find_by(id: params[:id])
    if @business.destroy
      render json: { message: 'business deleted'}, status: :ok
    end
  end

  def filter
    @params = CGI.parse(request.query_string)
    @businesses = Business.all
    isKeyword = false
    isLocation = false
    # if search is specific to type (categories = breakfast), filter where key = value
    @params.each { |key, value|
      # puts "k: #{key}, v: #{value}"
      if key == 'keyword'
        isKeyword = true
      end
      break if isKeyword
      if key == 'location'
        isLocation = true
      end
      break if isLocation
      @businesses = @businesses.where("#{key} LIKE ?", "%" + value[0] + "%")
    }
    # else, search is by keyword, filter businesses by name & category
    if isKeyword
      keyword = @params["keyword"][0]
      keyword = keyword.downcase
      @allBusinesses = Business.all
      filtered = []
      @name = @allBusinesses.where("LOWER(name) LIKE ?", "%" + keyword + "%")
      @category = @allBusinesses.where("LOWER(categories) LIKE ?", "%" + keyword + "%")
      filtered.push(@name).push(@category)
      @businesses = filtered.flatten.uniq
    end
    if isLocation
      location = @params["location"][0]
      @allBusinesses = Business.all
      filtered = []
      @city = @allBusinesses.where("city LIKE ?", "%" + location + "%")
      @state = @allBusinesses.where("state LIKE ?", "%" + location + "%")
      filtered.push(@city).push(@state)
      @businesses = filtered
    end
    render json: {
      params: @params,
      businesses: @businesses
    }
  end

  def categories
    @categories = Business.distinct.pluck(:categories)
    uniqueCategories = []
    # loop through each unique category array ["Breakfast & Brunch", "American (Traditional)"] for all businesses
    @categories.each do |category|
      puts category
      # loop through each category "Breakfast & Brunch"
      next if category.blank?
      category = JSON.parse(category)
      category.each do |cat|
        if !uniqueCategories.include? cat
          # puts "uniqueCategories doesnt have cat: #{cat}"
          uniqueCategories.push(cat)
        end
      end
    end
    uniqueCategories = uniqueCategories.sort
    render json: {
      categories: uniqueCategories
    }
  end

  def locations
    @businesses = Business.all
    uniqueLocations = []

    @businesses.each do |business|
      # loop through businesses to get all unique locations of: city, state
      next if business.city.blank? || business.state.blank?
      location = business.city.to_s + ', ' + business.state.to_s
      if !uniqueLocations.include? location
        uniqueLocations.push(location)
      end
    end

    render json: {
      locations: uniqueLocations
    }
  end


  private

  def business_params
    params
      .require(:business)
      .permit(:name, :address, :city, :state, :zipcode, :phone, :website, :categories, :user, :ratings, images: [])
  end
end
