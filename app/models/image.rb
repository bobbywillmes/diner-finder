class Image < ApplicationRecord
  belongs_to :user
  belongs_to :business
  belongs_to :review, optional: true

  has_one_attached :image

end
