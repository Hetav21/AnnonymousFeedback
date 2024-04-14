
import mongoose, {Schema, Document} from "mongoose";

export default interface Message extends Document{
    content: string,
    createdAt: Date
}

export const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})