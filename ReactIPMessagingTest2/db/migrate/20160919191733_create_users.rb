class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :username
      t.string :email
      t.string :password_digest
      t.string :session_token

      t.timestamps null: false
    end

    add_index :users, :username
    add_index :users, :session_token
  end
end
