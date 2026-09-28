import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  message = "Something went wrong while loading this data.",
  onRetry,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex items-center gap-3 bg-rose-600/5 border border-rose-600/20 text-rose-600 rounded-lg px-4 py-3 text-sm"
    >
      <AlertCircle size={18} className="shrink-0" />
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="font-medium underline underline-offset-2 hover:no-underline"
        >
          Retry
        </button>
      )}
    </div>
  );
}
