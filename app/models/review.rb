class Review < ApplicationRecord
  belongs_to :user
  belongs_to :business
  has_many :images, dependent: :destroy

  validates :text,        presence: true, length: {minimum: 1, allow_nil: false}
  validates :rating,      presence: true, length: {minimum: 1, maximum: 1, allow_nil: false}
  validates :business_id, presence: true
  validates :user_id,     presence: true

end
