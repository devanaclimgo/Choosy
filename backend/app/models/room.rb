class Room < ApplicationRecord
  has_many :players, dependent: :destroy
  has_many :votes, dependent: :destroy
end
