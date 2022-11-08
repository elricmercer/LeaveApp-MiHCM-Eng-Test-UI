import React from 'react'
import SidePanel from '../Components/SidePanel'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useRef } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CancelIcon from '@mui/icons-material/Cancel';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

function Dashboard() {
    document.title = "Dashboard"

    const effectRan = useRef(false)

    const [employeeData, setEmployeeData] = useState([])
    const [leaveRequestData, setLeaveRequestData] = useState([])
    const [leaveTypeData, setLeaveTypeData] = useState([])

    const [failedToApprove, setFailedToApprove] = useState(false)
    const [failedToReject, setFailedToReject] = useState(false)

    useEffect(() => {
        let empData = []
        setLeaveRequestData([])
        if(effectRan.current === true){
            const getEmployeesURL = `https://localhost:7011/api/EmployeeProfile/GetEmployeeProfile2/${JSON.parse(localStorage.getItem("loggedInAs"))}`
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
                    empData = response?.data
                    getLeaveRequests()
                }catch(err){}
            }

            const getLeaveRequests = () => {
                for(let i=0; i<empData.length; i++){
                    const URL = `https://localhost:7011/api/LeaveRequest/GetPendingLeaveRequests/${empData[i].employeeCode}`
                    const getFunc = async () => {
                        try{
                            const response = await axios.get(
                                URL,
                                {
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                }
                            )
                            
                            setLeaveRequestData(prevData => [...prevData, response?.data])
                        }catch(err){}
                    }

                    getFunc()
                }
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

                    setLeaveTypeData(response?.data)
                }catch(err){}
            }

            getEmployees()
            getLeaveTypes()
        }

        return () => {
            effectRan.current = true
        }
    }, [])

    const handleEmployeeName = (props) => {
        let name = ''
        for(let i=0; i<employeeData.length; i++){
            if(employeeData[i].employeeCode === props.employeeCode){
                name = employeeData[i].fullname
            }
        }

        return name
    }

    const handleEmployeeNumber = (props) => {
        let number = ''
        for(let i=0; i<employeeData.length; i++){
            if(employeeData[i].employeeCode === props.employeeCode){
                number = employeeData[i].number 
            }
        }

        return number
    }

    const handleLeaveTypeName = (props) => {
        let name = ''
        for(let i=0; i<leaveTypeData.length; i++){
            if(leaveTypeData[i].leaveTypeCode === props.leaveTypeCode){
                name = leaveTypeData[i].leaveTypeName
            }
        }

        return name
    }

    const handleApproveButton = async (props) => {
        setFailedToApprove(false)
        const approveURL = "https://localhost:7011/api/LeaveRequest/UpdatePendingLeaveRequests"
        try{
            const response = await axios.put(
                approveURL,
                {
                    leaveRequestCode: props.leaveRequestCode,
                    requestStatus: "C",
                    updatedBy: JSON.parse(localStorage.getItem("loggedInAs"))
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )

            window.location.reload()
        }catch(err){
            setFailedToApprove(true)
        }
    }

    const handleRejectButton = async (props) => {
        let leaveAllData = []

        setFailedToReject(false)
        const rejectURL = "https://localhost:7011/api/LeaveRequest/UpdatePendingLeaveRequests"
        const reject = async () => {
            try{
                const response = await axios.put(
                    rejectURL,
                    {
                        leaveRequestCode: props.leaveRequestCode,
                        requestStatus: "R",
                        updatedBy: JSON.parse(localStorage.getItem("loggedInAs"))
                    },
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                )

                getLeaveAllocation()
            }catch(err){
                setFailedToReject(true)
            }
        }

        const getLeaveAllocationURL = `https://localhost:7011/api/LeaveAllocation/GetLeaveAllocation2/${props.employeeCode}/${props.leaveTypeCode}`
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

                leaveAllData.push(response?.data[0])
                rollBackLeave()
            }catch(err){}
        }

        const rollBackLeaveURL = "https://localhost:7011/api/LeaveAllocation/UpdateLeaveAllocation"
        const rollBackLeave = async () => {
            try{
                const response = await axios.put(
                    rollBackLeaveURL,
                    {
                        employeeCode: props.employeeCode,
                        leaveTypeCode: props.leaveTypeCode,
                        used: (leaveAllData[0]?.used - props?.noOfDays) < 0 ? 0 : (leaveAllData[0]?.used - props?.noOfDays),
                        updatedBy: JSON.parse(localStorage.getItem("loggedInAs"))
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

        reject()
    }

    return (
        <div>
            <SidePanel />
            <div style={{ display:'flex', justifyContent:'center' }}>
                <Card sx={{ minWidth: 800 }}>
                    <CardContent>
                        <Typography variant="h5" component="div" sx={{marginBottom: "10px"}}>
                            Things to do
                        </Typography>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>{`Pending Leave Requests: ${leaveRequestData.length}`}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 800 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Number</TableCell>
                                                    <TableCell>Fullname</TableCell>
                                                    <TableCell>Leave Type</TableCell>
                                                    <TableCell>Start Date</TableCell>
                                                    <TableCell>End Date</TableCell>
                                                    <TableCell>Days</TableCell>
                                                    <TableCell>Reason</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell align="right">Aprrove</TableCell>
                                                    <TableCell align="right">Reject</TableCell>
                                                </TableRow>
                                            </TableHead>
                                                <TableBody>
                                                    {leaveRequestData.map((leaveReq) => (
                                                        <TableRow
                                                            key={leaveReq[0].leaveRequestCode}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell component="th" scope="row">
                                                                {handleEmployeeNumber(leaveReq[0])}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {handleEmployeeName(leaveReq[0])}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {handleLeaveTypeName(leaveReq[0])}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {leaveReq[0].fromDate}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {leaveReq[0].endDate}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {leaveReq[0].noOfDays}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {leaveReq[0].reason}
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {leaveReq[0].requestStatus === 'P' ? <AutorenewIcon /> : leaveReq[0].requestStatus === 'R' ? <CancelIcon /> : leaveReq[0].requestStatus === 'C' ? <ThumbUpIcon /> : <div></div>}
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={ () => {handleApproveButton(leaveReq[0])}}
                                                                    >
                                                                    Aprrove
                                                                </Button>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Button
                                                                    variant="contained"
                                                                    color="error"
                                                                    onClick={ () => {handleRejectButton(leaveReq[0])}}
                                                                    >
                                                                    Reject
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                        </Table>
                                    </TableContainer>
                                    {failedToApprove ? 
                                        <Stack sx={{ width: '100%', marginTop: "5px" }} spacing={2}>
                                            <Alert severity="error">Failed to approve!</Alert>
                                        </Stack>:
                                        <div></div>
                                    }
                                    {failedToReject ? 
                                        <Stack sx={{ width: '100%', marginTop: "5px" }} spacing={2}>
                                            <Alert severity="error">Failed to reject!</Alert>
                                        </Stack>:
                                        <div></div>
                                    }
                                </AccordionDetails>
                            </Accordion>
                    </CardContent>
                </Card>
            </div>
            
        </div>
    )
}

export default Dashboard
