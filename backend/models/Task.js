import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    taskDescription: {
      type: String,
      required: [true, "Task description is required"],
      trim: true,
    },

    code: {
      type: String,
      required: [true, "Code submission is required"],
    },

    // AI-generated evaluation fields
    aiScore: {
      type: Number,
      default: null,
    },

    aiStrengths: {
      type: [String],
      default: [],
    },

    aiImprovements: {
      type: [String],
      default: [],
    },

    aiFullFeedback: {
      type: String,
      default: "",
    },

    // Payment lock
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model("Task", taskSchema);
