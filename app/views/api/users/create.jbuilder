json.user do
  json.user_id    @user.id
  json.email      @user.email
  json.name       @user.name
  json.location   @user.location
  json.business   @user.businessAccount
  json.admin      @user.adminAccount
end
