class CreateFoodOptions < ActiveRecord::Migration[8.1]
  def change
    create_table :food_options do |t|
      t.string :name
      t.string :image_url

      t.timestamps
    end
  end
end
