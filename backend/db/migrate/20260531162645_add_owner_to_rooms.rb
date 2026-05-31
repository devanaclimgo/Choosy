class AddOwnerToRooms < ActiveRecord::Migration[8.0]
  def change
    add_reference :rooms, :owner, foreign_key: { to_table: :players }
  end
end