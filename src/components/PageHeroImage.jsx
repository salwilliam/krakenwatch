export default function PageHeroImage({ src, alt, priority = false, className = '' }) {
  return (
    <div
      className={`w-full rounded-xl overflow-hidden shadow-lg border-2 ${className}`}
      style={{ borderColor: 'hsl(30 30% 60%)', aspectRatio: '5 / 2' }}
    >
      <img
        src={src}
        alt={alt}
        fetchpriority={priority ? 'high' : undefined}
        className="w-full h-full object-cover block"
      />
    </div>
  );
}
