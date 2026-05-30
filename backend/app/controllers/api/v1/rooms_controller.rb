class Api::V1::RoomsController < Api::V1::BaseController
  before_action :set_room, only: [
    :show,
    :join,
    :start,
    :results
  ]

  def create
    room = Room.create!(
      code: generate_code,
      status: "waiting"
    )

    player = room.players.create!(
      name: params[:name]
    )

    room.update!(owner: player)

    render json: room, status: :created
  end

  def show
    render json: {
      id: @room.id,
      code: @room.code,
      status: @room.status,
      owner: @room.owner,
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
    room = Room.find(params[:id])

    unless room.owner_id == params[:player_id]
      return render json: {
        error: "Only the owner can start the voting"
      }, status: :forbidden
    end

    if room.players.count < 2
      return render json: {
        error: "At least 2 players are required to start the voting"
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