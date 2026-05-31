class Room < ApplicationRecord
  belongs_to :owner, class_name: "Player", optional: true
  has_many :players, dependent: :destroy
  has_many :votes, dependent: :destroy

  validates :code, presence: true, uniqueness: true

  before_validation :generate_code

  enum :status, {
    waiting: "waiting",
    voting: "voting",
    finished: "finished"
  }

  private

  def generate_code
    return if code.present?
    self.code = loop do
      random_code = SecureRandom.alphanumeric(6).upcase
      break random_code unless Room.exists?(code: random_code)
    end
  end
end