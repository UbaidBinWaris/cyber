"use client";

import { Icon } from "./Icon";
import { useCompleted, toggleCompleted } from "@/lib/useProgress";

/** Lets a learner mark a chapter complete; feeds the sidebar progress bar. */
export function CompleteButton({ slug }: { slug: string }) {
  const done = useCompleted().has(slug);

  return (
    <button
      type="button"
      className={`complete-btn ${done ? "complete-done" : ""}`}
      onClick={() => toggleCompleted(slug)}
    >
      <Icon name={done ? "shield" : "flag"} size={16} />
      {done ? "Completed" : "Mark as complete"}
    </button>
  );
}
