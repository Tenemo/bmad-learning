interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onDismiss, onRetry }: ErrorBannerProps) {
  return (
    <div className="error-banner" role="alert">
      <div>
        <p className="error-banner__label">Something went wrong</p>
        <p className="error-banner__message">{message}</p>
      </div>
      <div className="error-banner__actions">
        {onRetry ? (
          <button className="error-banner__button" type="button" onClick={onRetry}>
            Retry
          </button>
        ) : null}
        <button className="error-banner__button error-banner__button--ghost" type="button" onClick={onDismiss}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
