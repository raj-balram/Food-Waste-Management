import { useEffect, useState } from "react";
import API from "../services/api";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#ef4444"];

const AdminStats = () => {
  const [data, setData] = useState([]);

  const fetchStats = async () => {
    const res = await API.get("/admin/stats");
    setData(res.data.statusData);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Food Status Overview</h2>

      <PieChart width={300} height={300}>
        <Pie data={data} dataKey="value" outerRadius={100}>
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default AdminStats;