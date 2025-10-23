"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const STORAGE_KEY = "codefast-voted-posts";

const ButtonVote = ({ postId, initialVotes = 0 }) => {
    const [votes, setVotes] = useState(initialVotes);
    const [isLoading, setIsLoading] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        setVotes(initialVotes);
    }, [initialVotes]);

    useEffect(() => {
        if (!postId) return;

        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");

            if (Array.isArray(stored) && stored.includes(postId)) {
                setHasVoted(true);
            }
        } catch (error) {
            console.error("Failed to read vote cache", error);
        }
    }, [postId]);

    const updateLocalStorage = (nextHasVoted) => {
        if (!postId) return;

        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = JSON.parse(raw ?? "[]");
            const nextSet = new Set(Array.isArray(parsed) ? parsed : []);

            if (nextHasVoted) {
                nextSet.add(postId);
            } else {
                nextSet.delete(postId);
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify([...nextSet]));
        } catch (error) {
            console.error("Failed to update vote cache", error);
        }
    };

    const handleVote = async () => {
        if (isLoading || !postId) return;

        setIsLoading(true);

        try {
            const endpoint = `/api/vote?postId=${postId}`;

            const response = hasVoted
                ? await axios.delete(endpoint)
                : await axios.post(endpoint);

            const updatedVotes =
                typeof response?.data?.votesCounter === "number"
                    ? response.data.votesCounter
                    : hasVoted
                        ? votes - 1
                        : votes + 1;

            setVotes(updatedVotes);

            updateLocalStorage(!hasVoted);
            setHasVoted((prev) => !prev);
        } catch (error) {
            const errorMessage =
                error.response?.data?.error || error.message || "Something went wrong";

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const ariaLabel = useMemo(() => {
        if (isLoading) {
            return "Submitting your vote";
        }

        return hasVoted ? "Remove upvote" : "Upvote this post";
    }, [hasVoted, isLoading]);

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                type="button"
                onClick={handleVote}
                disabled={isLoading}
                aria-pressed={hasVoted}
                aria-label={ariaLabel}
                className={`btn btn-square border-2 ${
                    hasVoted
                        ? "btn-primary border-primary text-primary-content"
                        : "btn-ghost border-base-300 hover:border-primary hover:text-primary"
                }`}
            >
                {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={hasVoted ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="size-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 15.75 12 8.25l7.5 7.5"
                        />
                    </svg>
                )}
            </button>
            <span className="text-xs font-semibold text-base-content/70">
                {votes} vote{votes === 1 ? "" : "s"}
            </span>
        </div>
    );
};

export default ButtonVote;
