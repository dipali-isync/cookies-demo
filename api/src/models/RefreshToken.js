import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  iUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    // default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

refreshTokenSchema.statics.deleteExpired = async function () {
  return this.deleteMany({ expiresAt: { $lt: new Date() } });
};

refreshTokenSchema.statics.getExpiryByToken = async function (token) {
  const doc = await this.findOne({ token }).select("expiresAt").lean();
  return doc ? doc.expiresAt : null;
};
export default mongoose.models.RefreshToken ||
  mongoose.model("RefreshToken", refreshTokenSchema);
