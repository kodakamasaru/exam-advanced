/**
 * Error Boundary コンポーネント
 *
 * Preactのクラスコンポーネントでレンダリングエラーを捕捉
 */

import { Component, type ComponentChildren } from "preact";
import { logger } from "../lib";

/**
 * Error Boundary Props
 */
interface ErrorBoundaryProps {
  /** 子コンポーネント */
  children: ComponentChildren;
  /** カスタムフォールバックUI */
  fallback?: ComponentChildren | ((error: Error, reset: () => void) => ComponentChildren);
  /** エラー発生時のコールバック */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * Error Boundary State
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * エラー情報
 */
interface ErrorInfo {
  componentStack?: string;
}

/**
 * Error Boundary コンポーネント
 *
 * 使用例:
 * ```tsx
 * <ErrorBoundary fallback={<div>エラーが発生しました</div>}>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // または関数形式で再試行ボタン付き
 * <ErrorBoundary fallback={(error, reset) => (
 *   <div>
 *     <p>エラー: {error.message}</p>
 *     <button onClick={reset}>再試行</button>
 *   </div>
 * )}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error("React component error", {
      error,
      component: "ErrorBoundary",
      componentStack: errorInfo.componentStack,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * エラー状態をリセット
   */
  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ComponentChildren {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // カスタムフォールバックが関数の場合
      if (typeof fallback === "function") {
        return fallback(error, this.reset);
      }

      // カスタムフォールバックがある場合
      if (fallback) {
        return fallback;
      }

      // デフォルトフォールバック
      return (
        <div class="error-boundary">
          <div class="error-boundary__content">
            <h2 class="error-boundary__title">エラーが発生しました</h2>
            <p class="error-boundary__message">
              予期しないエラーが発生しました。ページを再読み込みしてください。
            </p>
            <div class="error-boundary__actions">
              <button
                class="btn btn--primary"
                onClick={() => window.location.reload()}
              >
                ページを再読み込み
              </button>
              <button class="btn btn--secondary" onClick={this.reset}>
                再試行
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}
