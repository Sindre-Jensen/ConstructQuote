interface CardProps {
  title: string;
  description: string;
}

export default function Card({ title, description }: CardProps) {
  return (
    <div className="flex-1 min-w-[280px] max-w-md bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}
