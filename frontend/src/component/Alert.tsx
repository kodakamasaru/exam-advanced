/**
 * アラートコンポーネント
 */

interface AlertProps {
  type: "error" | "success";
  message: string;
  onClose: () => void;
}

export function Alert({ type, message, onClose }: AlertProps) {
  if (!message) return null;

  const className = type === "error" ? "alert alert--error" : "alert alert--success";

  return (
    <div class={className}>
      <span>{message}</span>
      <button onClick={onClose} class="alert__close">
        &times;
      </button>
    </div>
  );
}
