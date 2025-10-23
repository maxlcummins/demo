// an API endpoint to create a new Post document in the database.
// The route is not protected by the auth middleware, so any user can create a post.
// The route expects a POST request to the title, and a description, in the request body.
// The boardId is in the query parameters.
// The userId field is poulated with the user's ID if the user is logged in (session exists).

import { NextResponse } from "next/server";
import { Filter } from "bad-words";
import connectMongo from "@/libs/mongoose";
import Post from "@/models/Post";
import User from "@/models/User";
import { auth } from "@/auth";

export async function POST(req, { params }) {
    try {

        const body = await req.json();
        const { title, description } = body;

        // URLSearchParams
        const { searchParams } = req.nextUrl;
        const boardId = searchParams.get("boardId");

        const badWordsFilter = new Filter();
        const sanitizedTitle = badWordsFilter.clean(title);
        const sanitizedDescription = badWordsFilter.clean(description);


        // Quick input validation
        if (!sanitizedTitle) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        const session = await auth();

        await connectMongo();

        const post = await Post.create({
            title: sanitizedTitle,
            description: sanitizedDescription,
            boardId,
            userId: session?.user?.id,
        });

        return NextResponse.json(post)
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = req.nextUrl;
        const postId = searchParams.get("postId");

        if (!postId) {
            return NextResponse.json(
                { error: "Post ID is required" },
                { status: 400 }
            );
        }

        const session = await auth();

        await connectMongo();

        const user = await User.findById(session?.user?.id);

        if (!user.hasAccess) {
            return NextResponse.json(
                { error: "Please login first" },
                { status: 403 }
            );
        }

        // check if the person deleting the post is the owner of the post

        const post = await Post.findById(postId);

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        if (!user.boards.includes(post.boardId.toString())) {
            return NextResponse.json(
                { error: "You do not have permission to delete this post" },
                { status: 403 }
            );
        }
        
        await Post.deleteOne({ _id: postId });

        return NextResponse.json({ message: "Post deleted successfully" });
    }
    catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}