import React, { useRef, useState } from 'react'
import SidePanel from '../Components/SidePanel'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import axios from 'axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CancelIcon from '@mui/icons-material/Cancel';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

function ViewLeaveHistory() {
    document.title = "Leave History"

    const effectRan = useRef(false)

    const [leaveRequestData, setLeaveRequestData] = useState([])
    const [leaveTypeData, setLeaveTypeData] = useState([])

    useEffect(() => {
        if(effectRan.current === true){
            const getLeaveRequestsURL = `https://localhost:7011/api/LeaveRequest/GetLeaveHistory/${JSON.parse(localStorage.getItem("loggedInAs"))}`
            const getLeaveRequests = async () => {
                try{
                    const response = await axios.get(
                        getLeaveRequestsURL,
                        {
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    )

                    setLeaveRequestData(response?.data)
                }catch(err){}
            }

            const getLeaveTypeURL = "https://localhost:7011/api/LeaveType/GetLeaveTypes"
            const getLeaveType = async () => {
                try{
                    const response = await axios.get(
                        getLeaveTypeURL,
                        {
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    )

                    setLeaveTypeData(response?.data)
                }catch(err){}
            }

            getLeaveRequests()
            getLeaveType()
        }

        return () => {
            effectRan.current = true
        }
    }, [])

    const handleLeaveTypeName = (props) => {
        let name = ''
        for(let i=0; i<leaveTypeData.length; i++){
            if(leaveTypeData[i].leaveTypeCode === props.leaveTypeCode){
                name = leaveTypeData[i].leaveTypeName
            }
        }

        return name
    }

    return (
        <div>
            <SidePanel />
            <div style={{ display:'flex', justifyContent:'center' }}>
                <Card sx={{ minWidth: 800 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            Leave History
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 600 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Leave Type</TableCell>
                                        <TableCell>Start Date</TableCell>
                                        <TableCell>End Date</TableCell>
                                        <TableCell>No of days</TableCell>
                                        <TableCell>Reason</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                    <TableBody>
                                    {leaveRequestData.map((leaveRD) => (
                                        <TableRow
                                            key={leaveRD.leaveRequestCode}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {handleLeaveTypeName(leaveRD)}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {leaveRD.fromDate}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {leaveRD.endDate}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {leaveRD.noOfDays}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {leaveRD.reason}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {leaveRD.requestStatus === 'P' ? <AutorenewIcon /> : leaveRD.requestStatus === 'R' ? <CancelIcon /> : leaveRD.requestStatus === 'C' ? <ThumbUpIcon /> : <div></div> }
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </div>
            
        </div>
    )
}

export default ViewLeaveHistory
