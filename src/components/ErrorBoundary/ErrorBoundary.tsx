import {
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  componentDidCatch(
    error: Error,
    info: ErrorInfo,
  ) {
    console.error(
      "ÖSÜŞ runtime error:",
      error,
      info,
    );
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6 text-text-primary">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 text-center shadow-[var(--app-shadow)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-danger/10 text-danger">
              !
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Bir näsazlyk ýüze çykdy
            </h1>

            <p className="mt-3 text-sm leading-6 text-text-muted">
              Programma garaşylmadyk ýalňyşlyk bilen
              ýüzbe-ýüz boldy. Maglumatlaryňyz ýerli
              storage-da saklanýar.
            </p>

            <button
              type="button"
              onClick={this.handleReload}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-slate-950 transition hover:bg-primary-hover"
            >
              Programmany täzeden aç
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}