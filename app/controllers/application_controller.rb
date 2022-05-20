class ApplicationController < ActionController::Base
  helper_method :logged_in?, :current_user

  def current_user
    token = cookies.signed[:diner_session_token]
    session = Session.find_by(token: token)
    if session
      @userId = session.user_id
      @user = User.find_by(id: @userId)
      return @user
    else
      return false
    end
  end

  def logged_in?
    !!current_user
    if current_user
      return true
    else
      return false
    end
  end

  def authorized
    redirect_to login_path unless logged_in?
  end
end
