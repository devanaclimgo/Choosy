class FoodOption < ApplicationRecord
  has_many :votes, dependent: :destroy

  validates :name, presence: true
  validates :image_url, presence: true
end