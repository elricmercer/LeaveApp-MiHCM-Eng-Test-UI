import React, { useState } from 'react'
import { Routes, Route} from 'react-router-dom'
import Dashboard from './Pages/Dashboard';
import { GlobalContext } from './Context/GlobalContext';
import AddEmployee from './Pages/AddEmployee';
import Login from './Pages/Login';
import ViewEmployees from './Pages/ViewEmployees';
import AddEmployeeType from './Pages/AddEmployeeType';
import ViewEmployeeTypes from './Pages/ViewEmployeeTypes';
import AddLeaveType from './Pages/AddLeaveType';
import ViewLeaveType from './Pages/ViewLeaveType';
import ViewLeaveAllocation from './Pages/ViewLeaveAllocation';
import ApplyLeave from './Pages/ApplyLeave';
import ViewLeaveHistory from './Pages/ViewLeaveHistory';

function App() {
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <>
      <GlobalContext.Provider value={{
        open, setOpen, selectedIndex, setSelectedIndex
      }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add_employee" element={<AddEmployee />} />
          <Route path="/view_employees" element={<ViewEmployees />} />
          <Route path="/add_employee_type" element={<AddEmployeeType />} />
          <Route path="/view_employee_types" element={<ViewEmployeeTypes />} />
          <Route path="/add_leave_type" element={<AddLeaveType />} />
          <Route path="/view_leave_types" element={<ViewLeaveType />} />
          <Route path="/view_leave_allocations" element={<ViewLeaveAllocation />} />
          <Route path="/apply_leave" element={<ApplyLeave />} />
          <Route path="/view_leave_history" element={<ViewLeaveHistory />} />
        </Routes>
      </GlobalContext.Provider>
    </>
  );
}

export default App;
