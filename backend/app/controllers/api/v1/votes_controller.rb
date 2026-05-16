class Api::V1::VotesController < ApplicationController
  def create
    vote = Vote.create!(vote_params)

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