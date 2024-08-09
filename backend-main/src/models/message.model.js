import mongoose from "mongoose";

const MessageModel = mongoose.Schema(
    {
        room_id: {
            type: String,
            trim: true,
            required: true,
        },
        send
        message_type: {
            type: String,
            enum: ["text", "image", "document", "audio", "video"],
        },
        seen_status: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("messages", MessageModel);
