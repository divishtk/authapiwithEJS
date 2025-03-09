import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: String,
    },
    posts :[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post"
      }
    ],
    profilePic:{
      type:String,
      default:"defaultpic.jpg"
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
});

userSchema.methods.isMatchPassword = async function (currentPassword) {
  return await bcrypt.compare(currentPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
