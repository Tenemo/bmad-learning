export function EmptyState() {
  return (
    <section className="empty-state" aria-live="polite">
      <p className="empty-state__eyebrow">Nothing queued</p>
      <h2 className="empty-state__title">Your list is clear.</h2>
      <p className="empty-state__body">Add the next task you want to keep in motion.</p>
    </section>
  );
}
