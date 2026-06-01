class Api::V1::VotesController < Api::V1::BaseController
  def create
    vote = Vote.create!(vote_params)

    player = vote.player

    total_foods = FoodOption.count

    if player.votes.count >= total_foods
      player.update!(finished_voting: true)
    end

    render json: vote, status: :created
  end

  private

  def vote_params
    params.require(:vote).permit(
      :room_id,
      :player_id,
      :food_option_id,
      :liked
    )
  end
end