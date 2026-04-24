export default function Loading() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center flex-col">
      <div className="spinner-ring">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <p className="text-gray-500 text-sm mt-4">Loading WatchFury...</p>
    </div>
  );
}
