import React from 'react'
import SidePanel from '../Components/SidePanel'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { useEffect } from 'react';
import { useRef } from 'react';
import axios from 'axios';
import { useState } from 'react';

function AddEmployee() {
    document.title = "Add Employee"

    const effectRan = useRef(false)

    const [employeeTypeData, setEmployeeTypeData] = useState([])
    const [employeeData, setEmployeeData] = useState([])
    const [leaveTypesData, setLeaveTypesData] = useState([])

    const [employeeTypeCode, setEmployeeTypeCode] = useState(0)
    const [employeeTypeName, setEmployeeTypeName] = useState('')
    const [reportingPersonCode, setReportingPersonCode] = useState(0)
    const [empNumber, setEmpNumber] = useState('')
    const [valEmpNumber, setValEmpNumber] = useState(true)
    const [empFullname, setEmpFullname] = useState('')
    const [valEmpFullname, setValEmpFullname] = useState(true)

    const [successToAdd, setSuccessToAdd] = useState(false)
    const [failedToAdd, setFailedToAdd] = useState(false)

    const [reloadMountUseEffect, setReloadMountUseEffect] = useState(false)

    useEffect(() => {
        if(effectRan.current === true){
            const getEmployeeTypeURL = "https://localhost:7011/api/EmployeeType/GetEmployeeTypes"
            const getEmployeeType = async () => {
                try{
                    const response = await axios.get(
                        getEmployeeTypeURL,
                        {
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    )

                    setEmployeeTypeData(response?.data)
                }catch(err){}
            } 
            
            const getEmployeeURL = "https://localhost:7011/api/EmployeeProfile/GetEmployeeProfiles"
            const getEmployee = async () => {
                try{
                    const response = await axios.get(
                        getEmployeeURL,
                        {
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    )

                    setEmployeeData(response?.data)
                }catch(err){}
            }

            const getLeaveTypesURL = "https://localhost:7011/api/LeaveType/GetLeaveTypes"
            const getLeaveTypes = async () => {
                try{
                    const response = await axios.get(
                        getLeaveTypesURL,
                        {
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    )

                    setLeaveTypesData(response?.data)
                }catch(err){}
            }

            getEmployeeType()
            getEmployee()
            getLeaveTypes()
        }

        return () => {
            effectRan.current = true
        }
    }, [reloadMountUseEffect,])

    useEffect(() => {
        setFailedToAdd(false)
        setSuccessToAdd(false)
        if(empNumber === ""){
            setValEmpNumber(true)
        }
        else{
            const regex = /^[a-zA-Z0-9 ]+$/
            let validity = regex.test(empNumber)
            setValEmpNumber(validity)
        }
    }, [empNumber])

    useEffect(() => {
        setFailedToAdd(false)
        setSuccessToAdd(false)
        if(empFullname === ""){
            setValEmpFullname(true)
        }
        else{
            const regex = /^[a-zA-Z ]+$/
            let validity = regex.test(empFullname)
            setValEmpFullname(validity)
        }
    }, [empFullname])

    const handleEmployeeTypeChange = (e) => {
        setFailedToAdd(false)
        setSuccessToAdd(false)
        setEmployeeTypeCode(e.target.value)

        for(let i=0; i<employeeTypeData.length; i++){
            if(employeeTypeData[i].employeeTypeCode === e.target.value){
                setEmployeeTypeName(employeeTypeData[i].employeeTypeName)
                break
            }
        }
    }

    const handleReportingPersonChange = (e) => {
        setFailedToAdd(false)
        setSuccessToAdd(false)
        setReportingPersonCode(e.target.value)
    }

    const handleAddButton = async () => {
        setFailedToAdd(false)
        setSuccessToAdd(false)
        let respondedEmpData = []
        if(empNumber !== "" && empFullname !== "" && valEmpNumber === true && valEmpFullname === true && employeeTypeCode!== 0){
            const addEmployeeProfileURL = "https://localhost:7011/api/EmployeeProfile/AddEmployeeProfile"
            const addEmployeeProfile = async () => {
                try{
                    const response = await axios.post(
                        addEmployeeProfileURL,
                        {
                            number: empNumber,
                            fullname: empFullname,
                            employeeTypeCode: employeeTypeCode,
                            reportingPersonCode: reportingPersonCode,
                            createdBy: JSON.parse(localStorage.getItem("loggedInAs")) || 0
                        },
                        {
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    )

                    respondedEmpData = response?.data
                    setSuccessToAdd(true)
                    leaveAllocateLoop()
                }catch(err){
                    setFailedToAdd(true)
                }
            }

            const addLeaveAllocationURL = "https://localhost:7011/api/LeaveAllocation/AddLeaveAllocation"
            const leaveAllocateLoop = async () => {
                for(let i=0; i<leaveTypesData.length;i++){
                    if(employeeTypeName === "wages board act"){
                        try{
                            const response = await axios.post(
                                addLeaveAllocationURL,
                                {
                                    employeeCode: respondedEmpData[0]?.employeeCode,
                                    leaveTypeCode: leaveTypesData[i]?.leaveTypeCode,
                                    allocated: leaveTypesData[i]?.leaveTypeName === "Annual leave" ? 10 : leaveTypesData[i]?.leaveTypeName === "Casual leave" ? 10 : leaveTypesData[i]?.leaveTypeName === "Medical leave" ? 10 : 0,
                                    createdBy: JSON.parse(localStorage.getItem("loggedInAs")) || 0
                                },
                                {
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                }
                            )
                        }catch(err){}
                    }
                    else if(employeeTypeName === "shop and office"){
                        try{
                            const response = await axios.post(
                                addLeaveAllocationURL,
                                {
                                    employeeCode: respondedEmpData[0]?.employeeCode,
                                    leaveTypeCode: leaveTypesData[i]?.leaveTypeCode,
                                    allocated: leaveTypesData[i]?.leaveTypeName === "Annual leave" ? 14 : leaveTypesData[i]?.leaveTypeName === "Casual leave" ? 7 : leaveTypesData[i]?.leaveTypeName === "Medical leave" ? 21 : 0,
                                    createdBy: JSON.parse(localStorage.getItem("loggedInAs")) || 0
                                },
                                {
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                }
                            )
                        }catch(err){}
                    }
                }

                setReloadMountUseEffect(!reloadMountUseEffect)
            }

            addEmployeeProfile()
        }
        else{
            setFailedToAdd(true)
        }
    }

    return (
        <div>
            <SidePanel />
            <div style={{ display:'flex', justifyContent:'center' }}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            Add Employee
                        </Typography>
                        <Box sx={{marginTop: "10px"}}>
                            {valEmpNumber ? 
                                <TextField id="outlined-basic" label="Number" variant="outlined" sx={{marginRight: "5px"}} value={empNumber} onChange={(e) => setEmpNumber(e.target.value)} />:
                                <TextField error id="outlined-basic" label="Number" variant="outlined" sx={{marginRight: "5px"}} value={empNumber} onChange={(e) => setEmpNumber(e.target.value)} />    
                            }
                            {valEmpFullname ? 
                                <TextField id="outlined-basic" label="Fullname" variant="outlined" sx={{marginRight: "5px"}} value={empFullname} onChange={(e) => setEmpFullname(e.target.value)} />:
                                <TextField error id="outlined-basic" label="Fullname" variant="outlined" sx={{marginRight: "5px"}} value={empFullname} onChange={(e) => setEmpFullname(e.target.value)} />
                            }
                            <FormControl sx={{ minWidth: 200, marginRight: "5px" }}>
                                <InputLabel id="empType-simple-select-label">EmployeeType</InputLabel>
                                <Select
                                    labelId="empType-simple-select-label"
                                    id="empType-simple-select"
                                    value={employeeTypeCode}
                                    label="EmployeeType"
                                    onChange={handleEmployeeTypeChange}
                                >
                                    {employeeTypeData.map((eType) => (
                                        <MenuItem key={eType.employeeTypeCode} value={eType.employeeTypeCode}>{eType.employeeTypeName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 200, marginRight: "5px" }}>
                                <InputLabel id="reportingPerson-simple-select-label">Reporting Person</InputLabel>
                                <Select
                                    labelId="reportingPerson-simple-select-label"
                                    id="reportingPerson-simple-select"
                                    value={reportingPersonCode}
                                    label="ReportingPerson"
                                    onChange={handleReportingPersonChange}
                                >
                                    {employeeData.map((emp) => (
                                        <MenuItem key={emp.employeeCode} value={emp.employeeCode}>{emp.number} | {emp.fullname}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Button variant="contained" sx={{marginTop: "20px"}} color="primary" onClick={() => handleAddButton()}>Add</Button>
                        {failedToAdd ? 
                            <Stack sx={{ width: '100%', marginTop: "5px" }} spacing={2}>
                                <Alert severity="error">Failed to add!</Alert>
                            </Stack>:
                            <div></div>
                        }
                        {successToAdd ? 
                            <Stack sx={{ width: '100%', marginTop: "5px" }} spacing={2}>
                                <Alert severity="success">Saved!!</Alert>
                            </Stack>:
                            <div></div>
                        }
                    </CardContent>
                </Card>
            </div>
            
        </div>
    )
}

export default AddEmployee
