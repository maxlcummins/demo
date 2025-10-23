import Link from "next/link";
import { redirect } from "next/navigation";
import connectMongo from "@/libs/mongoose";
import Board from "@/models/Board";
import Post from "@/models/Post";
import { auth } from "@/auth";
import CardBoardLink from "@/components/CardBoardLink";
import ButtonDeleteBoard from "@/components/ButtonDeleteBoard";
import CardPostAdmin from "@/components/CardPostAdmin";

const getData = async (boardId) => {
  const session = await auth();

  await connectMongo();

  const board = await Board.findOne({
    _id: boardId,
    userId: session?.user?.id,
  });

  if (!board) {
    redirect("/dashboard");
  }

  const posts = await Post.find({ boardId: board._id }).sort({ createdAt: -1 });

  return { board, posts };
};

export default async function FeedbackBoard({ params }) {
  const { boardId } = params;

  // Get board

  const { board, posts } = await getData(boardId);

  return (
    <main className="bg-base-200 min-h-screen">
      <section className="bg-base-100">
        <div className="max-w-5xl mx-auto px-5 py-3 flex">
          <Link href="/dashboard" className="btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
            Back
          </Link>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-5 py-12 flex flex-col md:flex-row gap-12">
        <div className="space-y-8 ">
          <h1 className="font-extrabold text-xl mb-4">{board.name}</h1>

        <CardBoardLink boardId={board._id.toString()} />

        <ButtonDeleteBoard boardId={board._id.toString()} /> 
        </div>
        <div className="w-full">
          {posts.length === 0 ? (
            <p className="text-base-content/70">No posts yet.</p>
          ) : (
            <ul className="space-y-4">
              {posts.map((post) => (
                <CardPostAdmin key={post._id.toString()} post={post} />
              ))}
            </ul>
          )}
        </div>
      </section>
    
    
    </main>
  );
}
