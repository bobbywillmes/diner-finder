json.total_pages @businesses.total_pages
json.next_page @businesses.next_page

json.businesses do
  json.array! @businesses do |business|
    json.id                  business.id
    json.name                business.name
    json.city                business.city
    json.state               business.state
    json.categories          business.categories
    json.reviewsSummary      business.reviewsSummary
  end
end