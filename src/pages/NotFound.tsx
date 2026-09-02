import InternalLink from '@components/InternalLink';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-8 px-8 py-16">
      <h1 className="text-5xl font-medium sm:text-6xl">404</h1>
      <p className="text-secondary text-center">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <InternalLink to="/">Go back home</InternalLink>
    </div>
  );
}
