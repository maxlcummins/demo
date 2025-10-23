"use client"; // Marks this file as a client-side component (required to use React hooks like useState and useRouter)

import { useState } from "react"; // React hook to manage local component state
import { useRouter } from "next/navigation"; // Next.js hook to programmatically navigate or refresh routes
import toast from "react-hot-toast";
import axios from "axios"; // Axios library for making HTTP requests

// Functional React component responsible for rendering a form to create a new feedback board
const FormAddPost = ({ boardId }) => {
  // Initialize Next.js router for programmatic navigation or page refresh
  const router = useRouter();

  // Declare state variable 'title' for storing the user's post title input
  const [title, setTitle] = useState("");

  // Declare state variable 'description' for storing the user's post description input
  const [description, setDescription] = useState("");

  // Declare state variable 'isLoading' to track whether a form submission is in progress
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload when the form is submitted

    // If already submitting, do nothing (prevents multiple rapid clicks)
    if (isLoading) return;

    // Set loading state to true (disables input/button and shows spinner)
    setIsLoading(true);

    try {
      // Send POST request to the server API route to create a new post
      // Body includes only the 'title' property as JSON
      await axios.post(`/api/post/?boardId=${boardId}`, { title, description });

      // Clear input field after successful submission
      setTitle("");
      setDescription("");

      toast.success("Post created!");

      // Trigger a revalidation or data refresh for the current route
      // This ensures the new post appears immediately in the UI
      router.refresh();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Something went wrong";
      // Handle any errors that occur during API request
      toast.error(errorMessage);

      // TODO: Optionally show a user-facing error message (e.g., toast or alert)
    } finally {
      // Always reset loading state, whether successful or failed
      setIsLoading(false);
    }
  };

  // JSX returned by the component (UI layout and interactive form)
  return (
    // Outer form container: card-style layout with background, padding, and spacing
    <form
      className="bg-base-100 p-8 rounded-3xl space-y-8 w-full md:w-96 shrink-0 md:sticky top-8"
      onSubmit={handleSubmit} // Attach event handler to manage form submission
    >
      {/* Heading for the form section */}
      <p className="font-bold text-lg">Suggest a feature</p>

      {/* --- FORM FIELDSET --- */}
      <fieldset className="fieldset">
        {/* Label for the board name input field */}
        <legend className="fieldset-legend">Short, descriptive title</legend>

        {/* Controlled text input: reflects and updates 'name' state */}
        <input
          required // Prevent submission if the field is empty
          type="text" // Plain text input type
          placeholder="Green buttons please" // Placeholder text inside input box
          className="input input-bordered w-full textarea h-12" // Tailwind/DaisyUI styling classes
          value={title} // Input value linked to component state
          maxLength={100} // Limit input length to 100 characters
          onChange={(event) => setTitle(event.target.value)} // Update state on user typing
        />
      </fieldset>
      <fieldset className="fieldsetborder-none">
        <legend className="fieldset-legend">Description</legend>
        <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={1000}
            placeholder="The login button would be better if it was green"
            className="textarea h-24 w-full" 
        ></textarea>
      </fieldset>

      {/* --- SUBMIT BUTTON --- */}
      <button
        className="btn btn-primary btn-block" // Primary-styled full-width button
        type="submit" // Declares this button submits the form
        disabled={isLoading} // Disables the button while loading
      >
        {/* Conditional: show spinner animation only when loading */}
        {isLoading && (
          <span className="loading loading-spinner loading-xl mr-2"></span>
        )}
        {/* Button label text */}
        Add Post
      </button>
    </form>
  );
};

// Export component as default so it can be imported in other files (e.g., Dashboard)
export default FormAddPost;
