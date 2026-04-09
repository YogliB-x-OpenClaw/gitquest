export function LandingHeader() {
  return (
    <header className="pt-16 pb-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="text-5xl select-none" aria-hidden="true">
          ♪
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-primary">GitSound</h1>
        <p className="text-base-content/60 text-lg max-w-sm leading-snug">
          Turn any GitHub repository's commit history into generative music
        </p>
      </div>
    </header>
  );
}
