class Api::V1::FoodOptionsController < Api::V1::BaseController
  def index
    foods = FoodOption.all

    render json: foods
  end
end