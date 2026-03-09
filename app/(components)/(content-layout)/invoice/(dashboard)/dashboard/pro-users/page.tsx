// Example usage in a dashboard component


import { getProUsersStats } from "../../../lib/pro-users";
import React from "react";
import ProUsersTable from "./table";

const Dashboard: React.FC = async () => {
  const stats = await getProUsersStats();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Pro Users</h3>
          <p className="text-3xl font-bold">{stats.totalProUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Monthly Revenue</h3>
          <p className="text-3xl font-bold">
            ${stats.monthlyRevenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Yearly Revenue</h3>
          <p className="text-3xl font-bold">
            ${stats.yearlyRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      <ProUsersTable />
    </div>
  );
};

export default Dashboard;
