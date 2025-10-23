import ButtonVote from "./ButtonVote";

const CardPost = ({ post }) => {
    const postId = typeof post._id === "string" ? post._id : post._id?.toString();
    const votesCounter = typeof post.votesCounter === "number" ? post.votesCounter : 0;

    return (
        <li className="bg-base-100 rounded-3xl p-6 flex justify-between items-center">
            <div>
                <div className="font-bold mb-1">{post.title}</div>
                <div className="opacity-80 leading-relaxed max-h-32 overflow-auto">{post.description}</div>
            </div>
            <ButtonVote postId={postId} initialVotes={votesCounter} />
        </li>
    );
};

export default CardPost;
