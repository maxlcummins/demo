// Route: POST /api/boards
// Purpose: Create a new Board document for the authenticated user, link it to the user, and return a response.
// Notes:
// - Assumes NextAuth is configured and `auth()` returns a session with `session.user.id` (Mongo ObjectId string).
// - Uses a shared Mongoose connection helper to avoid opening multiple connections in serverless envs.
// - Minimal validation (requires `name` in request body). Consider adding stronger validation (e.g., zod).
// - Returns empty JSON on success; you may want to return the created board for client convenience.

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Board from "@/models/Board";

export async function POST(req) {
  try {
    // Parse JSON body from the incoming request
    const body = await req.json();

    // Quick input validation: ensure a board name was provided
    if (!body.name) {
      return NextResponse.json(
        { error: "Board name is required" },
        { status: 400 }
      );
    }

    // Get the current user session (NextAuth). If no session, reject.
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // Ensure a MongoDB connection is established (idempotent helper)
    await connectMongo();

    // Load the user document using the id from the session
    // NOTE: If your NextAuth session uses a different field (e.g., `session.user._id`),
    // adjust accordingly.
    const user = await User.findById(session.user.id);

    // If somehow the session exists but the user isn't found, guard against it
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create the new Board with a reference to the user
    const board = await Board.create({
      userId: user._id,
      name: body.name,
      // TODO: Add other fields (e.g., description, visibility) as needed
    });

    // Push the board reference into the user's `boards` array
    user.boards.push(board._id);

    // Persist the updated user document
    await user.save();

    // Success response
    // TIP: Consider returning the created board for immediate UI updates:
    // return NextResponse.json({ board }, { status: 201 });
    return NextResponse.json(board.toObject(), { status: 201 });
  } catch (e) {
    // Centralized error handler: respond with error message and 500
    // TIP: Avoid leaking sensitive details in production. You could log `e` server-side and return a generic message.
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = req.nextUrl;
    const boardId = searchParams.get("boardId");

    if (!boardId) {
      return NextResponse.json(
        { error: "boardId is required" },
        { status: 400 }
      );
    }

    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    await Board.deleteOne({
      _id: boardId,
      userId: session?.user?.id,
    });

    const user = await User.findById(session?.user?.id);

    user.board = user.boards.filter((id) => id.toString() !== boardId);

    await user.save();

    return NextResponse.json({});
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
