json.total_pages @businesses.total_pages
json.next_page @businesses.next_page
json.total_count @businesses.total_count

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