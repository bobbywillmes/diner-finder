class Business < ApplicationRecord
  belongs_to :user
  has_many :images
  has_many :reviews
  has_many_attached :images

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

  validates :name,     presence: true, length: { minimum: 2, maximum: 200 }
  validates :address,  presence: true, length: { minimum: 5, maximum: 100 }
  validates :city,     presence: true, length: { minimum: 2, maximum: 50 }
  validates :state,    presence: true, length: { minimum: 2, maximum: 2 }

end
