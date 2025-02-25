import mongoose from "mongoose";


const postSchema = new mongoose.Schema(
  {
    user: {
      type:  mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    date: {
      type: Date,
      default: Date.now
    },
    content:{
        type:String
    },
    likes :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
    
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
