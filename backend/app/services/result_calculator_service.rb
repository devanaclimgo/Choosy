class ResultCalculatorService
  def initialize(room)
    @room = room
  end

  def call
    grouped_votes = FoodOption
      .joins(:votes)
      .where(votes: { room_id: @room.id, liked: true })
      .group("food_options.id")
      .select(
        "food_options.*,
        COUNT(votes.id) as likes_count"
      )
      .order("likes_count DESC")

    total_players = @room.players.count

    winner = grouped_votes.first

    return no_votes_response if winner.nil?

    percentage =
      (winner.likes_count.to_f / total_players * 100)

    if percentage >= 70
      {
        match: true,
        winner: winner,
        likes: winner.likes_count,
        percentage: percentage.round,
        top_3: grouped_votes.first(3)
      }
    else
      {
        match: false,
        top_3: grouped_votes.first(3)
      }
    end
  end

  private

  def no_votes_response
    {
      match: false,
      top_3: []
    }
  end
end