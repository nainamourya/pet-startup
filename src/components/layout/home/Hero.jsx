export default function Hero() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Your Pet Deserves Care, Not Compromise.
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Find trusted pet sitters for walks, day care, and home boarding —
          all in one calm, caring place.
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <button className="px-6 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition">
            Find a Sitter
          </button>
          <button className="px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition">
            Become a Sitter
          </button>
        </div>
      </div>
    </section>
  );
}
