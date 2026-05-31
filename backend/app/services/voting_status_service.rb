class VotingStatusService
  def initialize(room)
    @room = room
  end

  def call
    total_foods = FoodOption.count

    finished_players =
      @room.players.count do |player|
        player.votes.count >= total_foods
      end

    {
      players_count: @room.players.count,
      finished_players: finished_players,
      all_finished: finished_players == @room.players.count
    }
  end
end