# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_06_01_221017) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "food_options", force: :cascade do |t|
    t.string "category"
    t.datetime "created_at", null: false
    t.string "image_url"
    t.string "name"
    t.datetime "updated_at", null: false
  end

  create_table "players", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.boolean "finished_voting", default: false
    t.string "name"
    t.bigint "room_id", null: false
    t.datetime "updated_at", null: false
    t.index ["room_id"], name: "index_players_on_room_id"
  end

  create_table "rooms", force: :cascade do |t|
    t.string "code"
    t.datetime "created_at", null: false
    t.bigint "owner_id"
    t.string "status"
    t.datetime "updated_at", null: false
    t.index ["owner_id"], name: "index_rooms_on_owner_id"
  end

  create_table "votes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "food_option_id", null: false
    t.boolean "liked"
    t.bigint "player_id", null: false
    t.bigint "room_id", null: false
    t.datetime "updated_at", null: false
    t.index ["food_option_id"], name: "index_votes_on_food_option_id"
    t.index ["player_id"], name: "index_votes_on_player_id"
    t.index ["room_id"], name: "index_votes_on_room_id"
  end

  add_foreign_key "players", "rooms"
  add_foreign_key "rooms", "players", column: "owner_id"
  add_foreign_key "votes", "food_options"
  add_foreign_key "votes", "players"
  add_foreign_key "votes", "rooms"
end
