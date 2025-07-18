import React from 'react';
import { DashboardProps } from '../../types/dashboard/DashboardProps';
// import "./Dashboard.css";

const Dashboard:React.FC<DashboardProps> = ({ children, className })  => {
    return (
      <main className="dashboard">
          {children}
      </main>
    )
}

export default Dashboard;