Rails.application.routes.draw do
  root to: 'pages#home'

  get '/login'           => 'pages#login'
  get '/signup'          => 'pages#signup'
  get '/account'         => 'pages#account'
  get '/biz/:id'         => 'pages#business'
  get '/search'          => 'pages#search'

  namespace :api do
    # users
    post '/users'     => 'users#create'
    get '/user/:id'   => 'users#details'

    # sessions
    post '/sessions'        => 'sessions#create'
    delete '/sessions'      => 'sessions#destroy'
    get  '/authenticated'   => 'sessions#authenticated'

    # businesses
    post '/biz'           => 'businesses#create'
    get '/biz'            => 'businesses#index'
    get '/biz/:id'        => 'businesses#show'
    patch '/biz/:id'      => 'businesses#update'
    delete '/biz/:id'     => 'businesses#destroy'
    get '/search/'        => 'businesses#filter'
    get 'categories'      => 'businesses#categories'
    get 'locations'       => 'businesses#locations'

    # images
    post '/biz/:id/image' => 'images#create'
    get '/images'         => 'images#show'
    get '/biz/:id/images' => 'images#find'
    delete '/images/:id'  => 'images#delete'
    patch '/images/:id'   => 'images#update'
  end

end
