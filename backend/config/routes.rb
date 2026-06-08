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

  match "*path", via: [:options], to: proc {
    [200, {
      "Access-Control-Allow-Origin" => ENV.fetch("FRONTEND_URL", "*"),
      "Access-Control-Allow-Methods" => "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers" => "Origin, Content-Type, Accept, Authorization",
    }, [""]]
  }
end
