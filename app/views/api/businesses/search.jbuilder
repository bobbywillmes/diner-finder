json.businesses do
  json.array! @businesses do |business|
    json.id                  business.id
    json.name                business.name
    json.city                business.city
    json.state               business.state
    json.categories          business.categories
    json.reviewsSummary      business.reviewsSummary
    json.primaryPhoto        business.primaryPhoto
  end
end
json.keyword        @keyword
json.location       @location