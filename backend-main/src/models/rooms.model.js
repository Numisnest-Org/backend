import mongoose from "mongoose";

const ChatRoomModel = mongoose.Schema(
    {
        room_id: {
            type: String,
            trim: true,
            required: true,
        },
        sender_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "users",
            required: true,
        },
        receivse.SchemaTypes.ObjectId,
            ref: "users",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("chat_roos", ChatRoomModel);
