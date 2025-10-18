"use client";

import toast from "react-hot-toast";

const CardBoardLink = ({ boardId }) => {
  const boardLink = `${
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://scopesage.io"
  }/b/${boardId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(boardLink);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="bg-base-100 rounded-2xl text-sm px-4 py-2.5 flex items-center max-w-96">
      <p className="truncate">{boardLink}</p>
      <button className="btn btn-sm btn-neutral btn-square" onClick={copyLink}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-5"
        >
          <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12A1.5 1.5 0 0 1 17 6.622V12.5a1.5 1.5 0 0 1-1.5 1.5h-1v-3.379a3 3 0 0 0-.879-2.121L10.5 5.379A3 3 0 0 0 8.379 4.5H7v-1Z" />
          <path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L9.44 6.439A1.5 1.5 0 0 0 8.378 6H4.5Z" />
        </svg>
      </button>
    </div>
  );
};

export default CardBoardLink;
