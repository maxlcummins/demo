// A model for a post document in the database.
// Each post has a title, a description, a boardID to which it belongs,
// and a userID (option) of the user who created it (if logged in).
// The boardId and userId fields are references to the Board and User models respectively.

import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 1000,
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Board",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},
    { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", postSchema);

