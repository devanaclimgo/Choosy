Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :rooms, only: [
        :create,
        :show
      ] do
        member do
          post :join
          post :start
          get :status
          get :results
        end
      end
      resources :votes, only: [:create]
      resources :food_options, only: [:index]
    end
  end
end
