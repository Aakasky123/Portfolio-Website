export default function Footer({ name }) {
  return (
    <footer className="pb-10 pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 text-center text-sm text-[var(--color-text-muted)] sm:px-6">
        © {new Date().getFullYear()} {name}. Built with ❤️.
      </div>
    </footer>
  );
}
