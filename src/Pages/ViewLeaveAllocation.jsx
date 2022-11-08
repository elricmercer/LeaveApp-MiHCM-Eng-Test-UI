import React, { useEffect, useRef } from 'react'
import SidePanel from '../Components/SidePanel'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useState } from 'react';
import { Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

function ViewLeaveAllocation() {
    document.title = "View Leave Allocation"

    const effectRan = useRef(false)

    const [leaveAllocationData, setLeaveAllocationData] = useState([])
    const [leaveTypeData, setLeaveTypeData] = useState([])

    useEffect(() => {
        if(effectRan.current === true){
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
            
            getLeaveAllocation()
            getLeaveTypes()
        }

        return () => {
            effectRan.current = true
        }
    }, [])

    const handleLeaveTypeName = (props) => {
        let name = ''
        if(leaveTypeData.length > 0){
            for(let i=0; i<leaveTypeData.length; i++){
                if(leaveTypeData[i].leaveTypeCode === props.leaveTypeCode){
                    name = leaveTypeData[i].leaveTypeName
                    break
                }
            }
        }

        return name
    }
    
    return (
        <div>
            <SidePanel />
            <div style={{ display:'flex', justifyContent:'center' }}>
                <Card sx={{ minWidth: 700 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            View Leave Allocations
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 700 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Leave Type</TableCell>
                                        <TableCell>Leave Allocated</TableCell>
                                        <TableCell>Leave Used</TableCell>
                                        <TableCell>Leave Balance</TableCell>
                                    </TableRow>
                                </TableHead>
                                    <TableBody>
                                    {leaveAllocationData.map((leaveAll) => (
                                        <TableRow
                                            key={leaveAll.leaveAllocationCode}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {handleLeaveTypeName(leaveAll)}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {leaveAll.allocated}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {leaveAll.used}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {leaveAll.allocated - leaveAll.used}
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

export default ViewLeaveAllocation
