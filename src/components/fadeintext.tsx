import type { CSSProperties, ReactNode } from "react";
import { Children } from "react";
import "./fadeintext.css";

type FadeInTextProps = {
  id?: string;
  children: ReactNode;
  staggerMs?: number;
  durationMs?: number;
  distance?: string;
  className?: string;
};

function FadeInText({
  id = "",
  children,
  staggerMs = 800,
  durationMs = 600,
  distance = "8px",
  className = "",
}: FadeInTextProps) {
  const items = Children.toArray(children);
  const containerClass = ["fade-in-text", className].filter(Boolean).join(" ");
  const containerStyle: CSSProperties = {
    ["--fade-in-distance" as string]: distance,
    ["--fade-in-duration" as string]: `${durationMs}ms`,
  };

  return (
    <div id={id} className={containerClass} style={containerStyle}>
      {items.map((child, index) => {
        return (
          <div
            key={index}
            className="fade-in-text-item"
            style={{ animationDelay: `${index * staggerMs}ms` }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

export default FadeInText;
