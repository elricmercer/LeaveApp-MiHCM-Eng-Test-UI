import React, { useEffect, useRef } from 'react'
import SidePanel from '../Components/SidePanel'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useState } from 'react';
import { Alert, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import DateDiff from 'date-diff'

function ApplyLeave() {
    document.title = "Apply Leave"

    const effectRan = useRef(false)

    const [leaveTypeData, setLeaveTypeData] = useState([])
    const [leaveTypeCode, setLeaveTypeCode] = useState(0)
    const [leaveAllocationData, setLeaveAllocationData] = useState([])

    const [selectedLeave, setSelectedLeave] = useState(false)

    const [reloadSelectedLeave, setReloadSelectedLeave] = useState(false)
    const [leaveName, setLeaveName] = useState('')
    const [allocated, setAllocated] = useState(0)
    const [used, setUsed] = useState(0)

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [noOfDays, setNoOfDays] = useState(0)

    const [leaveReason, setLeaveReason] = useState('')

    const [failedToAddRequest, setFailedToAddRequest] = useState(false)

    useEffect(() => {
        if(effectRan.current === true){
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

                    setLeaveTypeData(response?.data)
                }catch(err){}
            }

            const getLeaveAllocationURL = `https://localhost:7011/api/LeaveAllocation/GetLeaveAllocation/${JSON.parse(localStorage.getItem("loggedInAs"))}`
            const getLeaveAllocation = async () => {
                try{
                    const response = await axios.get(
                        getLeaveAllocationURL,
                        {
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    )

                    setLeaveAllocationData(response?.data)
                }catch(err){}
            }
 
            getLeaveTypes()
            getLeaveAllocation()
        }

        return () => {
            effectRan.current = true
        }
    }, [])

    useEffect(() => {
        if(leaveTypeCode !== 0){
            setSelectedLeave(true)
        }
    }, [leaveTypeCode])

    useEffect(() => {
        if(leaveAllocationData.length > 0 && leaveTypeCode !== 0){
            for(let i=0; i<leaveAllocationData.length; i++){
                if(leaveAllocationData[i].leaveTypeCode === leaveTypeCode){
                    if(leaveTypeData.length > 0){
                        for(let j=0; j<leaveTypeData.length; j++){
                            if(leaveTypeData[j].leaveTypeCode === leaveTypeCode){
                                setLeaveName(leaveTypeData[j].leaveTypeName)
                            }
                        }
                    }
                    setAllocated(leaveAllocationData[i].allocated)
                    setUsed(leaveAllocationData[i].used)
                    break
                }
            }
        }
    }, [reloadSelectedLeave])

    useEffect(() => {
        let newStartDate = new Date(startDate)
        let newEndDate = new Date(endDate)

        if(endDate >= startDate){
            let diff = new DateDiff(newEndDate, newStartDate)
            setNoOfDays(diff.days()+1)
        }
        else{
            setNoOfDays(0)
        }
    }, [startDate, endDate])

    const handleLeaveTypeChange = (e) => {
        setLeaveTypeCode(e.target.value)
        setReloadSelectedLeave(!reloadSelectedLeave)
    }

    const handleApplyLeave = async () => {
        const addLeaveRequestURL = "https://localhost:7011/api/LeaveRequest/AddLeaveRequests"
        const addLeaveRequest = async () => {
            try{
                const response = await axios.post(
                    addLeaveRequestURL,
                    {
                        employeeCode: JSON.parse(localStorage.getItem("loggedInAs")),
                        leaveTypeCode: leaveTypeCode,
                        fromDate: startDate,
                        endDate: endDate,
                        noOfDays: noOfDays,
                        reason: leaveReason,
                        createdBy: JSON.parse(localStorage.getItem("loggedInAs"))
                    }
                )
                updateLeaveAllocation()
            }catch(err){
                setFailedToAddRequest(true)
            }
        }

        const updateLeaveAllocationURL = "https://localhost:7011/api/LeaveAllocation/UpdateLeaveAllocation"
        const updateLeaveAllocation = async () => {
            try{
                const response = await axios.put(
                    updateLeaveAllocationURL,
                    {
                        employeeCode: JSON.parse(localStorage.getItem("loggedInAs")),
                        leaveTypeCode: leaveTypeCode,
                        used: used+noOfDays,
                        updatedBy: 0
                    },
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                )

                window.location.reload()
            }catch(err){}
        }

        addLeaveRequest()
    }

    return (
        <div>
            <SidePanel />
            <div style={{ display:'flex', justifyContent:'center' }}>
                <Card sx={{ minWidth: 700 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            Apply Leave
                        </Typography>
                        <FormControl sx={{ minWidth: 300, marginRight: "5px", marginTop: "20px", marginBottom: "20px" }}>
                            <InputLabel id="leaveType-simple-select-label">Leave Type</InputLabel>
                            <Select
                                labelId="leaveType-simple-select-label"
                                id="leaveType-simple-select"
                                value={leaveTypeCode}
                                label="LeaveType"
                                onChange={handleLeaveTypeChange}
                            >
                                {leaveTypeData.map((lType) => (
                                    <MenuItem key={lType.leaveTypeCode} value={lType.leaveTypeCode}>{lType.leaveTypeName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {selectedLeave ? 
                            <div>
                                <Typography variant="subtitle1" component="div" sx={{marginBottom: "10px"}}>
                                    {`Leave: ${leaveName} | Allocated: ${allocated} | Used: ${used} | Balance: ${allocated-used}`}
                                </Typography>
                            </div> : 
                            <div></div>
                        }
                        {allocated-used > 0 ? 
                            <div>
                                <label>Start Date </label>
                                <input id='startDate' type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                                <label>  End Date </label>
                                <input id='endDate' type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                                <Typography variant="subtitle1" component="div" sx={{marginTop: "10px", marginBottom: "10px"}}>
                                    {`Days: ${noOfDays}`}
                                </Typography>
                                <TextField id="outlined-multiline-static" label="Reason...." multiline rows={4} fullWidth onChange={(e) => setLeaveReason(e.target.value)}/>
                                <div className="display-linebreak">
                                    {noOfDays > allocated-used ? 
                                        <Button variant="contained" sx={{marginTop: "20px"}} color="primary" disabled>Apply</Button>:
                                        <Button variant="contained" sx={{marginTop: "20px"}} color="primary" onClick={() => handleApplyLeave()}>Apply</Button>
                                    }
                                </div>
                                {failedToAddRequest ? 
                                    <Stack sx={{ width: '100%', marginTop: "5px" }} spacing={2}>
                                        <Alert severity="error">Failed to process request!</Alert>
                                    </Stack>:
                                    <div></div> 
                                }
                            </div> : 
                            <div></div>
                        }
                    </CardContent>
                </Card>
            </div>
            
        </div>
    )
}

export default ApplyLeave
