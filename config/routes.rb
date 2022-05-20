Rails.application.routes.draw do
  root to: 'pages#home'

  get '/login'           => 'pages#login'
  get '/signup'          => 'pages#signup'
  get '/account'         => 'pages#account'

  namespace :api do
    # users
    post '/users'     => 'users#create'
    get '/user/:id'   => 'users#details'

    # sessions
    post '/sessions'        => 'sessions#create'
    delete '/sessions'      => 'sessions#destroy'
    get  '/authenticated'   => 'sessions#authenticated'
  end

end
