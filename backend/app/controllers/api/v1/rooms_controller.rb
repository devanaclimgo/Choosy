class Api::V1::RoomsController < Api::V1::BaseController
  before_action :set_room, only: [
    :show,
    :join,
    :start,
    :status,
    :results
  ]

  def create
    Room.transaction do
      room = Room.create!(
        status: "waiting"
      )

      player = room.players.create!(
        name: params[:name]
      )

      room.update!(owner: player)

      render json: {
        id: room.id,
        code: room.code,
        status: room.status,
        owner_id: player.id,
        players: [player]
      }, status: :created
    end
  end

  def show
    render json: {
      id: @room.id,
      code: @room.code,
      status: @room.status,
      owner_id: @room.owner_id,
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
    unless @room.owner_id == params[:player_id].to_i
      return render json: {
        error: "Only the owner can start the voting"
      }, status: :forbidden
    end

    if @room.players.count < 2
      return render json: {
        error: "At least 2 players are required to start the voting"
      }, status: :unprocessable_entity
    end

    @room.players.update_all(finished_voting: false)

    @room.update!(status: "voting")
    puts @room.reload.status

    render json: {
      message: "Voting started"
    }
  end

  def status
    finished_players =
      @room.players.where(finished_voting: true).count

    players_count =
      @room.players.count

    if players_count == finished_players
      @room.update!(status: "finished")
    end

    render json: {
      players_count: players_count,
      finished_players: finished_players,
      all_finished: players_count == finished_players
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