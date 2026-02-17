import React from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-4",
  lg: "h-12 w-12 border-8",
};

const Loading: React.FC<LoadingProps> = ({
  size = "md",
  color = "border-blue-500",
  className = "",
}) => {
  const spinnerSize = sizeClasses[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full ${spinnerSize} border-t-transparent ${color}`}
      />
    </div>
  );
};

export default Loading;
