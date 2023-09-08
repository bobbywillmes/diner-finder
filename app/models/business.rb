class Business < ApplicationRecord
  belongs_to :user
  has_many :images
  has_many :reviews
  has_many_attached :images

  include Rails.application.routes.url_helpers

  def reviewsSummary
    @reviews = Review.where(business_id: self.id)
    reviewAvg = @reviews.average('rating').to_f.round(1)
    reviewCount = @reviews.length
    if reviewCount == 0
      reviewAvg = 'N/A'
    end
    return {
      avg: reviewAvg,
      count: reviewCount
    }
  end

  def primaryPhoto
    if primary_photo_id
      primaryPhoto = Image.find_by(id: self.primary_photo_id)
      @primaryPhoto = {
        id: primaryPhoto.id,
        business_id: primaryPhoto.business_id,
        description: primaryPhoto.description,
        category: primaryPhoto.category,
        url: url_for(primaryPhoto.image)
      }
    else
      @primaryPhoto = {
        isPlaceholder: true,
        url: ActionController::Base.helpers.asset_path('nophoto.png', disposition: 'attachment', only_path: true)
      }
    end
    return @primaryPhoto
  end

  validates :name,     presence: true, length: { minimum: 2, maximum: 200 }
  validates :address,  presence: true, length: { minimum: 5, maximum: 100 }
  validates :city,     presence: true, length: { minimum: 2, maximum: 50 }
  validates :state,    presence: true, length: { minimum: 2, maximum: 2 }

end
