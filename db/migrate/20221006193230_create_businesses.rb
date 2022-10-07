class CreateBusinesses < ActiveRecord::Migration[6.1]
  def change
    create_table :businesses do |t|
      t.string  :name
      t.string  :address
      t.string  :city
      t.string  :state
      t.string  :zipcode
      t.string  :phone
      t.string  :website
      t.text    :categories
      t.belongs_to :user, index: true, foreign_key: true

      t.timestamps
    end
  end
end
