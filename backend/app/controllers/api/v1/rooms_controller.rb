class Api::V1::RoomsController < Api::V1::BaseController
  before_action :set_room, only: [
    :show,
    :join,
    :start,
    :results
  ]

  def create
    room = Room.create!(
      status: "waiting"
    )

    render json: room, status: :created
  end

  def show
    render json: {
      id: @room.id,
      code: @room.code,
      status: @room.status,
      players: @room.players.select(:id, :name)
    }
  end

  def join
    return render json: {
      error: "Name is required"
    }, status: :unprocessable_entity if params[:name].blank?

    player = @room.players.create!(
      name: params[:name]
    )
    
    render json: player, status: :created
  end

  def start
    if @room.players.count < 2
      return render json: {
        error: "Need at least 2 players"
      }, status: :unprocessable_entity
    end

    @room.update!(status: "voting")

    render json: {
      message: "Voting started"
    }
  end

  def results
    results =
      ResultCalculatorService
        .new(@room)
        .call

    render json: results
  end

  private

  def set_room
    @room = Room.find_by!(code: params[:id])
  end
end