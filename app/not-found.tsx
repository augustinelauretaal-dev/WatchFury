import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-black gradient-text mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-8">
        The drama you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-bold transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
}
