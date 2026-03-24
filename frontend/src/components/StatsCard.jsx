const StatsCard = ({ title, value, color = "green", icon }) => {
  const colorMap = {
    green: "text-green-500 bg-green-50",
    blue: "text-blue-500 bg-blue-50",
    purple: "text-purple-500 bg-purple-50",
    yellow: "text-yellow-500 bg-yellow-50",
    red: "text-red-500 bg-red-50",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </h3>
        {icon && (
          <span className={`text-2xl p-2 rounded-xl ${colorMap[color]}`}>
            {icon}
          </span>
        )}
      </div>
      <p className={`text-3xl font-bold ${colorMap[color].split(" ")[0]}`}>
        {value ?? "—"}
      </p>
    </div>
  );
};

export default StatsCard;