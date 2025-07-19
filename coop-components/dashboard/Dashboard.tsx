import React from 'react';
import { DashboardProps } from '../../types/dashboard/DashboardProps';
// import "./Dashboard.css";

const Dashboard:React.FC<DashboardProps> = ({ children, className })  => {
    return (
      <div className={className}>
        {children}
      </div>
    )
}

export default Dashboard;