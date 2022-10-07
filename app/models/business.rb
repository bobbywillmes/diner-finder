class Business < ApplicationRecord
  belongs_to :user

  validates :name,     presence: true, length: { minimum: 2, maximum: 200 }
  validates :address,  presence: true, length: { minimum: 5, maximum: 100 }
  validates :city,     presence: true, length: { minimum: 2, maximum: 50 }
  validates :state,    presence: true, length: { minimum: 2, maximum: 2 }

end
