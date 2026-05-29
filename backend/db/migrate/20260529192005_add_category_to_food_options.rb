class AddCategoryToFoodOptions < ActiveRecord::Migration[8.1]
  def change
    add_column :food_options, :category, :string
  end
end
