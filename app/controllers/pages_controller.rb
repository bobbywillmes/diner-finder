class PagesController < ApplicationController

  def home
    render 'home'
  end

  def login
    if logged_in?
      redirect_to('/account')
    else
      render 'login'
    end
  end

  def signup
    if logged_in?
      redirect_to('/account')
    else
      render 'signup'
    end
  end

  def account
    if logged_in?
      @user = current_user
      render 'account'
    else
      redirect_to('/login')
    end
  end

end
