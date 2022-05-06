class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.string  :email
      t.string  :name
      t.string  :password
      t.string  :location
      t.boolean :businessAccount, default: false
      t.boolean :adminAccount, default: false

      t.timestamps
    end
  end
end
