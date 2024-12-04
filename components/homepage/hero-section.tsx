export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center leading-6 md:mt-[3rem]">
      <h1
        className={`hero-title lobster-regular text-7xl scroll-m-20 font-semibold tracking-tight text-center max-w-[1120px] bg-gradient-to-b text-white`}
      >
        Call Santa
        {/* <span className="text-3xl"> . Shop</span> */}
      </h1>
      <p className="hero-subtitle lobster-regular text-center text-2xl sm:text-4xl text-white">
        No Scripts, Just Magic—Every Chat with Santa is One of a Kind.
      </p>
    </section>
  );
}
