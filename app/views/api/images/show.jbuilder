json.images do
  json.array! @images do |img|
    json.id             img.id
    json.description    img.description
    json.category       img.category
    json.business_id    img.business_id
    json.user_id        img.user_id
    json.url            url_for(img.image)
  end
end