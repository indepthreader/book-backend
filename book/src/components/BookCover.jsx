import { useState } from "react";
import { makeCover } from "../utils/books";

export default function BookCover({ book, large = false }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`book-cover ${large ? "large" : ""} ${book.coverImage ? "has-image" : ""}`}
        style={
          book.coverImage
            ? undefined
            : { background: book.color || makeCover(book.title) }
        }
        onClick={() => {
          if (book.coverImage) setOpen(true);
        }}
      >
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={`${book.title} cover`}
            className="book-cover-image"
          />
        ) : (
          <>
            <span>{book.title?.slice(0, 1) || "B"}</span>
            <strong>{book.title}</strong>
          </>
        )}
      </button>

      {open && (
        <div className="cover-modal" onClick={() => setOpen(false)}>
          <div
            className="cover-modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="cover-close"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
            <img
              src={book.coverImage}
              alt={`${book.title} full cover`}
              className="cover-modal-image"
            />
          </div>
        </div>
      )}
    </>
  );
}
