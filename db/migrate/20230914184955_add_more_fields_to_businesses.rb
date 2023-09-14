class AddMoreFieldsToBusinesses < ActiveRecord::Migration[6.1]
  def change
    add_column :businesses, :price, :string
    add_column :businesses, :hours, :text
    add_column :businesses, :about, :text
    add_column :businesses, :history, :text
  end
end
