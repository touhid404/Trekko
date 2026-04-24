

export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] w-full flex-col items-center justify-center pt-24 px-4 sm:px-6 lg:px-8">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Tropical beach"
          className="h-full w-full object-cover"
        />
        {/* Soft gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/10"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center mt-[-10vh]">
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
          Discover Your Next Amazing Journey Excitement and Wonder!
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base font-medium text-white/90 sm:text-lg">
          Embark on your next incredible adventure filled with excitement and wonder, where every moment is an opportunity to explore new horizons and create unforgettable memories.
        </p>
      </div>
    </section>
  )
}
