import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    user_id: { type: String, unique: true },
    username: String,
    first_name: String,
    last_name: String,
    phone_number: String,
    last_state: String,
    user_lang: {
      type: String,
      enum: ["UZB", "RUS"],
    },
    tg_link: String,
  },
  { timestamps: true }
);


const User = mongoose.model('User', UserSchema);

export default User; 


