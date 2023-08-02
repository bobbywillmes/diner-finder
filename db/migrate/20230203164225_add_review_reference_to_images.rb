class AddReviewReferenceToImages < ActiveRecord::Migration[6.1]
  def change
    add_column :images, :review_id, :integer
    add_foreign_key :images, :reviews
  end
end
