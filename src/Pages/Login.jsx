import React from 'react'
import SidePanel from '../Components/SidePanel'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

function Login() {
    document.title = "Login"

    const effectRan = useRef(false)

    const [employeeData, setEmployeeData] = useState([])
    const [selectedEmployeeCode, setSelectedEmployeeCode] = useState(0)

    useEffect(() => {
        if(effectRan.current === true){
            const getEmployeesURL = "https://localhost:7011/api/EmployeeProfile/GetEmployeeProfiles"
            const getEmployees = async () => {
                try{
                    const response = await axios.get(
                        getEmployeesURL,
                        {
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    )

                    setEmployeeData(response?.data)
                }catch(err){}
            }

            getEmployees()
        }

        return () => {
            effectRan.current = true
        }
    }, [])

    const handleEmployeeChange = (e) => {
        setSelectedEmployeeCode(e.target.value)
    }

    const handleLogin = () => {
        if(selectedEmployeeCode !== 0){
            localStorage.setItem("loggedInAs", JSON.stringify(selectedEmployeeCode))
            window.location.reload()
        }
    }

    return (
        <div>
            <SidePanel />
            <div style={{ display:'flex', justifyContent:'center' }}>
                <Card sx={{ minWidth: 500 }}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                            Login
                        </Typography>
                        <FormControl sx={{ minWidth: 500, marginRight: "5px", marginTop: "20px" }}>
                            <InputLabel id="emp-simple-select-label">Employees</InputLabel>
                            <Select
                                labelId="emp-simple-select-label"
                                id="emp-simple-select"
                                value={selectedEmployeeCode}
                                label="Employees"
                                onChange={handleEmployeeChange}
                            >
                                {employeeData.map((emp) => (
                                    <MenuItem key={emp.employeeCode} value={emp.employeeCode}>{emp.number} | {emp.fullname}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained" sx={{marginTop: "20px"}} color="primary" onClick={() => handleLogin()}>Login As</Button>
                    </CardContent>
                </Card>
            </div>
            
        </div>
    )
}

export default Login
