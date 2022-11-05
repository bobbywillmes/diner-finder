class CreateImages < ActiveRecord::Migration[6.1]
  def change
    create_table :images do |t|
      t.string  :description
      t.string  :category
      t.belongs_to :business, index: true, foreign_key: true
      t.belongs_to :user,     index: true, foreign_key: true

      t.timestamps
    end
  end
end
