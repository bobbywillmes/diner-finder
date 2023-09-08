class AddPrimaryPhotoToBusinesses < ActiveRecord::Migration[6.1]
  def change
    add_reference :businesses, :primary_photo, foreign_key: { to_table: :images }
  end
end
