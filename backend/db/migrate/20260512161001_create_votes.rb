class CreateVotes < ActiveRecord::Migration[8.1]
  def change
    create_table :votes do |t|
      t.references :room, null: false, foreign_key: true
      t.references :player, null: false, foreign_key: true
      t.references :food_option, null: false, foreign_key: true
      t.boolean :liked

      t.timestamps
    end
  end
end
