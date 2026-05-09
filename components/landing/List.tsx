export default function List() {
  const features = [
    "Select items from your library",
    "Instant total calculation",
    "Professional PDF export",
    "Save client templates",
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4 text-lg">Quick Start</h3>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
