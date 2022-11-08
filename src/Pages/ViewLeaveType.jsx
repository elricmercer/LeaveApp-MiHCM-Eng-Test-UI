import React, { useEffect, useRef } from 'react'
import SidePanel from '../Components/SidePanel'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useState } from 'react';
import { Alert, Box, Button, Modal, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';

function ViewLeaveType() {
    document.title = "View Leave Types"

    const effectRan = useRef(false)

    const [leaveTypeData, setLeaveTypeData] = useState([])
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [valEditLTypeName, setValEditLTypeName] = useState(true)
    const [editLTypeName, setEditLTypeName] = useState('')
    const [currEditLTypeName, setCurrEditLTypeName] = useState('')
    const [editLTypeCode, setEditLTypeCode] = useState(0)
    const [errMsgEditLTypeName, setErrMsgEditLTypeName] = useState(false)

    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [failedToDelete, setFailedToDelete] = useState(false)

    useEffect(() => {
        if(effectRan.current === true){
            const getLeaveTypesURL = "https://localhost:7011/api/LeaveType/GetLeaveTypes"
            const getLeaveTypes = async () => {
                try{
                    const response = await axios.get(
                        getLeaveTypesURL,
                        {
                            headers: {
                                "Content-type": "application/json"
                            }
                        }
                    )
                    
                    setLeaveTypeData(response?.data)
                }catch(err){}
            }

            getLeaveTypes()
        }

        return () => {
            effectRan.current = true
        }
    }, [])

    useEffect(() => {
        if(editLTypeName === ""){
            setValEditLTypeName(false)
        }
        else{
            const regex = /^[a-zA-Z0-9 ]+$/
            let validity = regex.test(editLTypeName)
            setValEditLTypeName(validity)
        }
    }, [editLTypeName])

    const handleEditButton = (props) => {
        setEditLTypeName(props.leaveTypeName)
        setCurrEditLTypeName(props.leaveTypeName)
        setEditLTypeCode(props.leaveTypeCode)
        setErrMsgEditLTypeName(false)
        handleEditOpen()
    }

    const handleDeleteButton = (props) => {
        setEditLTypeName(props.leaveTypeName)
        setCurrEditLTypeName(props.leaveTypeName)
        setEditLTypeCode(props.leaveTypeCode)
        handleDeleteOpen()
    }

    const handleEditOpen = () => setEditModalOpen(true)
    const handleEditClose = () => setEditModalOpen(false)

    const handleDeleteOpen = () => setDeleteModalOpen(true);
    const handleDeleteClose = () => setDeleteModalOpen(false);

    const handleModalEditButton = async () => {
        if(editLTypeName !== currEditLTypeName && valEditLTypeName === true && editLTypeName !== ""){
            const editLTypeNameURL = "https://localhost:7011/api/LeaveType/UpdateLeaveTypeName"
            const editLTypeNameFUNC = async () =>{
                try{
                    const response = await axios.put(
                        editLTypeNameURL,
                        {
                            leaveTypeCode: editLTypeCode,
                            leaveTypeName: editLTypeName
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    )
                    updateTrack()
                }catch(err){
                    setErrMsgEditLTypeName(true)
                }
            }

            const updateTrackURL = "https://localhost:7011/api/LeaveType/UpdateLeaveType"
            const updateTrack = async () => {
                try{
                    const response = await axios.put(
                        updateTrackURL,
                        {
                            leaveTypeCode: editLTypeCode,
                            updatedBy: JSON.parse(localStorage.getItem("loggedInAs")) || 0
                        } 
                    )
                    window.location.reload()
                }catch(err){}
            }

            editLTypeNameFUNC()
        }
        else{
            setErrMsgEditLTypeName(true)
        }
    }

    const handleModalDeleteButton = async () => {
        const deleteURL = "https://localhost:7011/api/LeaveType/DeleteLeaveTypes"
        const deleteLType = async () => {
            try{
                const response = await axios.put(
                    deleteURL,
                    {
                        leaveTypeCode: editLTypeCode,
                        deleted: true,
                        deletedBy: JSON.parse(localStorage.getItem("loggedInAs")) || 0
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )

                window.location.reload()
            }catch(err){
                setFailedToDelete(true)
            }
        }
        
        deleteLType()
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <div>
            <SidePanel />
            <div style={{ display:'flex', justifyContent:'center' }}>
                <Card sx={{ minWidth: 600 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            View Leave Types
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 600 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Leave Type</TableCell>
                                        <TableCell align="right">Edit</TableCell>
                                        <TableCell align="right">Delete</TableCell>
                                    </TableRow>
                                </TableHead>
                                    <TableBody>
                                    {leaveTypeData.map((lType) => (
                                        <TableRow
                                            key={lType.leaveTypeCode}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {lType.leaveTypeName}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={ () => {handleEditButton(lType)}}
                                                    >
                                                    Edit
                                                </Button>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={ () => {handleDeleteButton(lType)}}
                                                    >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                            </Table>
                        </TableContainer>
                        <Modal
                            open={editModalOpen}
                            onClose={handleEditClose}
                            aria-labelledby="modal-modal-edit"
                        >
                            <Box sx={style}>
                                <Typography id="modal-modal-edit" variant="h6" component="h2">
                                    Edit
                                </Typography>
                                <Typography id="modal-modal-edit" variant="subtitle1" component="h2" sx={{marginBottom: "5px"}}>
                                    Leave type name
                                </Typography>
                                {valEditLTypeName ? 
                                    <TextField id="outlined-basic" label="Ok" variant="outlined" onChange={(e) => setEditLTypeName(e.target.value)} value={editLTypeName} />:
                                    <TextField error id="outlined-error" label="Error" variant="outlined" onChange={(e) => setEditLTypeName(e.target.value)} value={editLTypeName} />
                                }
                                <Button variant="text" onClick={() => {handleModalEditButton()}}>Edit</Button>
                                {errMsgEditLTypeName ? 
                                    <Stack sx={{ width: '100%', marginTop: "5px" }} spacing={2}>
                                        <Alert severity="error">Failed to edit!</Alert>
                                    </Stack> :
                                    <div></div>   
                                }
                            </Box>
                        </Modal>
                        <Modal
                            open={deleteModalOpen}
                            onClose={handleDeleteClose}
                            aria-labelledby="modal-modal-delete"
                        >
                            <Box sx={style}>
                                <Typography id="modal-modal-delete" variant="h6" component="h2">
                                    Delete
                                </Typography>
                                <Button variant="contained" color="error" onClick={() => {handleModalDeleteButton()}}>Yes</Button>
                                {failedToDelete ? 
                                    <Stack sx={{ width: '100%', marginTop: "5px" }} spacing={2}>
                                        <Alert severity="error">Failed to delete!</Alert>
                                    </Stack> :
                                    <div></div>   
                                }
                            </Box>
                        </Modal>
                    </CardContent>
                </Card>
            </div>
            
        </div>
    )
}

export default ViewLeaveType
