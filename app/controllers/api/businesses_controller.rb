class Api::BusinessesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    # if location is set on frontend localStorage, get businesses for that location, otherwise (location not set or set to all locations) return all businesses
    if params[:location] != 'All locations' # has location
      @allBusinesses = Business.all
        page = params[:page] == 'undefined' ? 1: params[:page]
        location = params[:location]
        location = location.downcase
        split = location.split(',')
        results = []
        if split.length == 2  # filter by city & state
          city = split[0]
          state = split[1].strip
          results = Business.where("(LOWER(city) LIKE ? AND LOWER(state) LIKE ?)", "%" + city + "%", "%" + state + "%").page(page).per(10)
        else  # filter by city or state
          results = Business.where("LOWER(city) LIKE ? OR LOWER(state) LIKE ?", "%" + location + "%", "%" + location + "%").page(page).per(10)
        end
        @businesses = results
        
    else
      @businesses = Business.order(id: :asc).page(params[:page]).per(10)
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
        location = location.downcase
      end
    }

    page = params[:page] == 'undefined' ? 1 : params[:page]

    if location == 'all locations' || location == ''
      isLocation = false
    end
    if keyword == ''
      isKeyword = false
    end

    # filter by keyword (name or category) & location
    if isKeyword && isLocation
      split = location.split(',')
      results = []
      if split.length == 2  # filter by city & state
        city = split[0]
        state = split[1].strip
        results = Business.where("(LOWER(city) LIKE ? AND LOWER(state) LIKE ?) AND (LOWER(name) LIKE ? OR LOWER(categories) LIKE ?)", "%" + city + "%", "%" + state + "%", "%" + keyword + "%", "%" + keyword + "%")
          .page(page).per(10)
      else  # filter by city or state
        results = Business.where("(LOWER(city) LIKE ? OR LOWER(state) LIKE ?) AND (LOWER(name) LIKE ? OR LOWER(categories) LIKE ?)", "%" + location + "%", "%" + location + "%", "%" + keyword + "%", "%" + keyword + "%")
          .page(page).per(10)
      end

      @businesses = results
      @keyword = keyword
      @location = location
      return render 'api/businesses/search', status: :ok
    end

    # if search is by keyword, filter businesses by name or category
    if isKeyword
      results = Business.where("LOWER(name) LIKE ? OR LOWER(categories) LIKE ?", "%" + keyword + "%", "%" + keyword + "%").page(page).per(10)
      @businesses = results
      @keyword = keyword
    end

    # if search is by location, filter businesses by city & state
    if isLocation
      split = location.split(',')
      results = []
      if split.length == 2  # filter by city & state'
        city = split[0]
        state = split[1].strip
        results = Business.where("(LOWER(city) LIKE ? AND LOWER(state) LIKE ?)", "%" + city + "%", "%" + state + "%").page(page).per(10)
      else  # filter by city or state
        results = Business.where("LOWER(city) LIKE ? OR LOWER(state) LIKE ?", "%" + location + "%", "%" + location + "%").page(page).per(10)
      end
      @businesses = results
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
    uniqueLocations = ['All locations']

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
