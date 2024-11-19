interface BandProps {
  children: React.ReactNode;
  className?: string;
}

export function Band({ children, className }: BandProps) {
  return (
    <div className="relative h-[100px]">
      <div className="absolute w-screen left-1/2 -translate-x-1/2 h-full bg-black/90">
        {/* Top stitching */}
        <div className="absolute top-2 left-0 w-full border-0 border-t border-dotted border-zinc-800" />
        <div className="absolute top-3 left-0 w-full border-0 border-t border-dotted border-zinc-800" />

        {/* Bottom stitching */}
        <div className="absolute bottom-2 left-0 w-full border-0 border-t border-dotted border-zinc-800" />
        <div className="absolute bottom-3 left-0 w-full border-0 border-t border-dotted border-zinc-800" />
      </div>
      <div
        className={`relative h-full flex items-center justify-center ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
