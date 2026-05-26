import { useState } from "react";

function ErrorButton() {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  if (shouldThrowError) {
    throw new Error("Test application error");
  }

  return (
    <button
      className="mt-6 rounded-lg bg-red-600 px-5 py-2 font-medium text-white hover:bg-red-700"
      type="button"
      onClick={() => setShouldThrowError(true)}>
      Test Error Boundary
    </button>
  );
}

export default ErrorButton;
