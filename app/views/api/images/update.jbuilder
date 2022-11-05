json.image do
  json.id             @image.id
  json.description    @image.description
  json.category       @image.category
  json.business_id    @image.business_id
  json.user_id        @image.user_id
  json.url            url_for(@image.image)
end