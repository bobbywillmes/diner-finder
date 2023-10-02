json.user do
  json.user_id       @user.id
  json.email         @user.email
  json.name          @user.name
  json.location      @user.location
  json.join_date     @user.created_at

  json.imageCount   @imageCount
  json.reviewCount  @reviewCount

  json.images do
    json.array! @images do |image|
      json.id           image.id
      json.user_id      image.user_id
      json.businessName image.business.name
      json.date         image.created_at
      json.description  image.description
      json.category     image.category
      json.review_id    image.review_id
      json.business_id  image.business_id
      json.src          url_for(image.image)
    end
  end

  json.reviews do
    json.array! @reviews do |review|
      json.id             review.id
      json.text           review.text
      json.rating         review.rating
      json.business_id    review.business_id
      json.businessName   review.business.name
      json.user_id        review.user_id
      json.userName       review.user.name
      json.userLocation   review.user.location
      json.date           review.created_at

      json.images do
        json.array! review.images do |image|
          json.id               image.id
          json.description      image.description
          json.category         image.category
          json.date             image.created_at
          json.src        url_for(image.image)
        end
      end
    end
  end

end
