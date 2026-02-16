import {useEffect, useState} from "react";

export const ProgressBar = ({ isActive }: { isActive: boolean }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      queueMicrotask(() => {
        setProgress(100);
        const t = setTimeout(() => {
          setProgress(0);
        }, 400);
        return () => clearTimeout(t);
      });
      return;
    }

    queueMicrotask(() => {
      setProgress(10);
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 92) {
            clearInterval(interval);
            return p;
          }
          return Math.min(p + Math.random() * 10 + 6, 92);
        });
      }, 160);
      return () => clearInterval(interval);
    });
  }, [isActive]);

  if (progress === 0) return null;

  return (
    <div className="w-full h-1 bg-gray-200 rounded overflow-hidden">
      <div
        className="h-full bg-blue-600 transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}