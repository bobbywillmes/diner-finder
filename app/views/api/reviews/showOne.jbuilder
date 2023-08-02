json.review do
      json.id             @review.id
      json.text           @review.text
      json.rating         @review.rating
      json.business_id    @review.business_id
      json.user_id        @review.user_id
      json.userName       @review.user.name
      json.userLocation   @review.user.location
      json.date           @review.created_at

      json.images do
        json.array! @review.images do |image|
          json.id         image.id
          json.description         image.description
          json.category         image.category
          json.src        url_for(image.image)
        end
      end
      
end