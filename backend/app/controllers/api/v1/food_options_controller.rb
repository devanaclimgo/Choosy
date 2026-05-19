class Api::V1::FoodOptionsController < ApplicationController
  def index
    foods = FoodOption.all

    render json: foods
  end
end