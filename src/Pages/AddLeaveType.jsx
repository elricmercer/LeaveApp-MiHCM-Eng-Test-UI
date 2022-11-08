import React from 'react'
import SidePanel from '../Components/SidePanel'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Alert, Box, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

function AddLeaveType() {
    document.title = "Add Leave Type"

    const [leaveTypeName, setLeaveTypeName] = useState("")
    const [valLeaveTypeName, setValLeaveTypeName] = useState(true)

    const [failedToAdd, setFailedToAdd] = useState(false)
    const [successToAdd, setSuccessToAdd] = useState(false)

    useEffect(() => {
        setFailedToAdd(false)
        setSuccessToAdd(false)
        if(leaveTypeName !== ""){
            const regex = /^[a-zA-Z0-9 ]+$/
            let validity = regex.test(leaveTypeName)
            setValLeaveTypeName(validity)
        }
    }, [leaveTypeName])

    const handleAddButton = async () => {
        setFailedToAdd(false)
        setSuccessToAdd(false)
        if(valLeaveTypeName === true && leaveTypeName !== ""){
            const addLeaveTypeURL= "https://localhost:7011/api/LeaveType/AddLeaveType"
            try{
                const response = await axios.post(
                    addLeaveTypeURL,
                    {
                        leaveTypeName: leaveTypeName,
                        createdBy: JSON.parse(localStorage.getItem("loggedInAs")) || 0
                    },
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                )

                setSuccessToAdd(true)
            }catch(err){
                setFailedToAdd(true)
            }
        }
        else{
            setFailedToAdd(true)
        }
    }

    return (
        <div>
            <SidePanel />
            <div style={{ display:'flex', justifyContent:'center' }}>
                <Card sx={{ minWidth: 300 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            Add Leave Type
                        </Typography>
                        <Box sx={{marginTop: "10px"}}>
                            {valLeaveTypeName ? 
                                <TextField id="outlined-basic" label="Leave Type" variant="outlined" sx={{marginRight: "5px"}} value={leaveTypeName} onChange={(e) => setLeaveTypeName(e.target.value)} />:
                                <TextField error id="outlined-basic" label="Leave Type" variant="outlined" sx={{marginRight: "5px"}} value={leaveTypeName} onChange={(e) => setLeaveTypeName(e.target.value)} />    
                            }
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

export default AddLeaveType
