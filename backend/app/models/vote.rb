class Vote < ApplicationRecord
  belongs_to :room
  belongs_to :player
  belongs_to :food_option

  validates :liked, inclusion: { in: [true, false] }

  validates :food_option_id,
    uniqueness: {
      scope: :player_id,
      message: "already voted"
    }
end