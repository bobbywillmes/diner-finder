json.business do
  json.id         @business.id
  json.name       @business.name
  json.address    @business.address
  json.city       @business.city
  json.state      @business.state
  json.zipcode    @business.zipcode
  json.phone      @business.phone
  json.website    @business.website
  json.categories @business.categories
  json.user_id    @business.user_id
  json.created_at @business.created_at
  json.updated_at @business.updated_at
end
