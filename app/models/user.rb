class User < ApplicationRecord
  has_many :sessions

  validates :email,     presence: true, length: { minimum: 5, maximum: 500 }
  validates :name,      presence: true, length: { minimum: 2, maximum: 200 }
  validates :password,  presence: true, length: { minimum: 8, maximum: 64 }
  validates :location,  presence: true, length: { minimum: 5, maximum: 200 }

  validates_uniqueness_of :email, :case_sensitive => false

  after_validation :hash_password

  private

  def hash_password
    self.password = BCrypt::Password.create(self.password)
  end
end