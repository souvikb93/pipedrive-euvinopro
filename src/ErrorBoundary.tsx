import * as React from 'react';
import { Button, EmptyState } from '@euvino/ds';

interface State {
  failed: boolean;
}

/** Last line of defence: a render error shows a calm message with a way out instead of a blank page. */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main>
        <EmptyState
          icon="warning-circle"
          title="Diese Ansicht konnte nicht geladen werden"
          description="Laden Sie die Seite neu. Ihre Daten sind davon nicht betroffen."
          action={
            <Button variant="primary" onClick={() => window.location.reload()}>
              Seite neu laden
            </Button>
          }
        />
      </main>
    );
  }
}
