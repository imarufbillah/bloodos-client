export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center gap-8 text-center">
        <h1 className="font-heading text-5xl font-bold tracking-tight">
          Welcome to <span className="text-crimson">BloodOS</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Verified blood donor coordination platform matching urgent hospital
          requests with eligible donors in Bangladesh.
        </p>
        <div className="flex gap-4">
          <a
            href="/requests"
            className="inline-flex items-center rounded-md bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Browse Requests
          </a>
          <a
            href="/requests/add"
            className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Post a Request
          </a>
        </div>
        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            ✅ Phase 6a complete: Theme system with oklch colors
            <br />
            ✅ Phase 7a complete: Navbar with auth, theme toggle, and notification slot
            <br />
            🔄 Next: Phase 7b (Footer) → Phase 7c-7h (Components) → Phase 8 (Pages)
          </p>
        </div>
      </div>
    </div>
  );
}
