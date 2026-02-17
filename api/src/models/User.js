import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    vEmail: {
      type: String,
      required: true,
      unique: true,
    },
    vPassword: {
      type: String,
      required: true,
    },
    vFullName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = async function (
  condidatePassword
) {
  return bcrypt.compare(condidatePassword, this.vPassword);
};

export default mongoose.models.User || mongoose.model("User", userSchema);
