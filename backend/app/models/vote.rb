class Vote < ApplicationRecord
  belongs_to :room
  belongs_to :player
  belongs_to :food_option
end
