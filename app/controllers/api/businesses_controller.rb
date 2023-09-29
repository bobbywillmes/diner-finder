class Api::BusinessesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    # if location is set on frontend localStorage, get businesses for that location, otherwise (location not set or set to all locations) return all businesses
    if params[:location] != 'All locations'
        @businesses = Business.where("city LIKE ?", "%" + params[:location] + "%").page(params[:page]).per(10)
    else
      @businesses = Business.order(created_at: :asc).page(params[:page]).per(10)
      # @businesses = Business.order(Arel.sql('RANDOM()')).page(params[:page]).per(10)
    end
    return render json: { error: 'not_found' }, status: :not_found if !@businesses
    render 'api/businesses/index', status: :ok
  end

  def show
    @business = Business.find_by(id: params[:id])
    @images = Image.where(business_id: params[:id])
    @reviews = Review.where(business_id: params[:id]).order(created_at: :desc)
    @hoursStr = @business.hours.gsub! '\{', '{'    # remove \ before {
    @hoursStr = @hoursStr.gsub! '\}', '}'           # remove \ before }
    @hours = JSON.parse @hoursStr

    # get session/user info to edit a business
    user = nil
    token = cookies.signed[:diner_session_token]
    session = Session.find_by(token: token)
    @userInfo = nil
    if session
      user = session.user
      isOwner = @business.user_id == user.id
      @userInfo = {
        loggedIn: true,
        user: user,
        isOwner: isOwner
      }
    else
      @userInfo = {
        loggedIn: false,
        user: 'not logged in'
      }
    end

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
    if session
      user = session.user
    else
      return render json: {message: 'must be logged in'}, status: :forbidden
    end

    @business = Business.find_by(id: params[:id])

    return render json: {message: 'not authorized'}, status: :forbidden if @business.user_id != user.id

    return render 'not_found', status: :not_found if not @business
    return render json: {
      message: 'error updating',
      # error: error
    }, status: :bad_request if not @business.update(business_params)
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
    keyword = nil
    location = nil
    # loop through params to determine how to filter for results (keyword and/or location)
    @params.each { |key, value|
      # puts "k: #{key}, v: #{value}"
      if key == 'keyword'
        isKeyword = true
        keyword = params[:keyword]
        keyword = keyword.downcase
      end
      if key == 'location'
        isLocation = true
        location = params[:location]
      end
    }

    # filter by keyword (name or category) & location
    if isKeyword && isLocation
      @allBusinesses = Business.all
      filtered = []
      # first get all businesses that match location, then filter both name & category by the keyword.
      @location = @allBusinesses.where("city LIKE ?", "%" + location + "%")
      @name = @location.where("LOWER(name) LIKE ?", "%" + keyword + "%")
      @category = @location.where("LOWER(categories) LIKE ?", "%" + keyword + "%")
      # push results to filtered array, flatten it & remove duplicates
      filtered.push(@name).push(@category)
      @businesses = filtered.flatten.uniq
      @keyword = keyword
      @location = location
      return render 'api/businesses/search', status: :ok
    end

    # if search is by keyword, filter businesses by name & category
    if isKeyword
      @allBusinesses = Business.all
      filtered = []
      @name = @allBusinesses.where("LOWER(name) LIKE ?", "%" + keyword + "%")
      @category = @allBusinesses.where("LOWER(categories) LIKE ?", "%" + keyword + "%")
      filtered.push(@name).push(@category)
      @businesses = filtered.flatten.uniq
      @keyword = keyword
    end

    # if search is by location, filter businesses by city & state
    if isLocation
      @allBusinesses = Business.all
      filtered = []
      @city = @allBusinesses.where("city LIKE ?", "%" + location + "%")
      @state = @allBusinesses.where("state LIKE ?", "%" + location + "%")
      filtered.push(@city).push(@state)
      @businesses = filtered.flatten.uniq
      @location = location
    end
    render 'api/businesses/search', status: :ok
  end

  def categories
    @categories = Business.distinct.pluck(:categories)
    uniqueCategories = []
    # loop through each unique category array ["Breakfast & Brunch", "American (Traditional)"] for all businesses
    @categories.each do |category|
      # loop through each category "Breakfast & Brunch"
      next if category.blank?
      category = JSON.parse(category)
      category.each do |cat|
        catStr = cat.strip    # remove leading space
        if !uniqueCategories.include? catStr
          # puts "uniqueCategories doesnt have cat: #{catStr}"
          uniqueCategories.push(catStr)
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
      .permit(:name, :address, :city, :state, :zipcode, :phone, :website, :categories, :user, :ratings, :primary_photo_id, :primary_photo, images: [])
  end
end
