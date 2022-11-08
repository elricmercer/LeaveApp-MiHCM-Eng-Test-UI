import React, { useEffect, useRef, useState } from 'react'
import SidePanel from '../Components/SidePanel'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { Alert, Box, Button, Modal, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';

function ViewEmployeeTypes() {
    document.title = "View Employee Type"

    const effectRan = useRef(false)

    const [empTypeData, setEmpTypeData] = useState([])
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editEmpTypeCode, setEditEmpTypeCode] = useState(0)
    const [editEmpTypeName, setEditEmpTypeName] = useState('')
    const [currEditEmpTypeName, setCurrEditEmpTypeName] = useState('')
    const [valEditEmpTypeName, setValEditEmpTypeName] = useState(true)
    const [errMsgEditEmpTypeName, setErrMsgEditEmpTypeName] = useState(false)

    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [failedToDelete, setFailedToDelete] = useState(false)

    useEffect(() => {
        if(effectRan.current === true){
            const getEmployeeTypesURL = "https://localhost:7011/api/EmployeeType/GetEmployeeTypes"
            const getEmployeeTypes = async () => {
                try{
                    const response = await axios.get(
                        getEmployeeTypesURL,
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    )

                    setEmpTypeData(response?.data)
                }catch(err){}
            }

            getEmployeeTypes()
        }

        return () => {
            effectRan.current = true
        }
    }, [])

    const handleEditButton = (props) => {
        setEditEmpTypeCode(props.employeeTypeCode)
        setEditEmpTypeName(props.employeeTypeName)
        setCurrEditEmpTypeName(props.employeeTypeName)
        setErrMsgEditEmpTypeName(false)
        handleEditOpen()
    }

    const handleDeleteButton = async (props) => {
        setEditEmpTypeCode(props.employeeTypeCode)
        setEditEmpTypeName(props.employeeTypeName)
        setCurrEditEmpTypeName(props.employeeTypeName)
        handleDeleteOpen()
    }

    const handleEditOpen = () => setEditModalOpen(true);
    const handleEditClose = () => setEditModalOpen(false);

    const handleDeleteOpen = () => setDeleteModalOpen(true);
    const handleDeleteClose = () => setDeleteModalOpen(false);

    useEffect(() => {
        if(editEmpTypeName === ""){
            setValEditEmpTypeName(false)
        }
        else{
            const regex = /^[a-zA-Z0-9 ]+$/
            let validity = regex.test(editEmpTypeName)
            setValEditEmpTypeName(validity)
        }
    }, [editEmpTypeName])

    const handleModalEditButton = async () => {
        if(editEmpTypeName !== currEditEmpTypeName && valEditEmpTypeName === true && editEmpTypeName !== ""){
            const editEmpTypeNameURL = "https://localhost:7011/api/EmployeeType/UpdateEmployeeTypeName"
            const editEmpTypeNameFUNC = async () =>{
                try{
                    const response = await axios.put(
                        editEmpTypeNameURL,
                        {
                            employeeTypeCode: editEmpTypeCode,
                            employeeTypeName: editEmpTypeName
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    )
                    updateTrack()
                }catch(err){
                    setErrMsgEditEmpTypeName(true)
                }
            }

            const updateTrackURL = "https://localhost:7011/api/EmployeeType/UpdateEmployeeType"
            const updateTrack = async () => {
                try{
                    const response = await axios.put(
                        updateTrackURL,
                        {
                            employeeTypeCode: editEmpTypeCode,
                            updatedBy: JSON.parse(localStorage.getItem("loggedInAs")) || 0
                        } 
                    )
                    window.location.reload()
                }catch(err){}
            }

            editEmpTypeNameFUNC()
        }
        else{
            setErrMsgEditEmpTypeName(true)
        }
    }

    const handleModalDeleteButton = async () => {
        const deleteURL = "https://localhost:7011/api/EmployeeType/DeleteEmployeeType"
        const deleteEmpType = async () => {
            try{
                const response = await axios.put(
                    deleteURL,
                    {
                        employeeTypeCode: editEmpTypeCode,
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
        
        deleteEmpType()
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
                            View Employee Types
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 600 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Employee Type</TableCell>
                                        <TableCell align="right">Edit</TableCell>
                                        <TableCell align="right">Delete</TableCell>
                                    </TableRow>
                                </TableHead>
                                    <TableBody>
                                    {empTypeData.map((empType) => (
                                        <TableRow
                                            key={empType.employeeTypeCode}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {empType.employeeTypeName}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={ () => {handleEditButton(empType)}}
                                                    >
                                                    Edit
                                                </Button>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={ () => {handleDeleteButton(empType)}}
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
                                    Employee type name
                                </Typography>
                                {valEditEmpTypeName ? 
                                    <TextField id="outlined-basic" label="Ok" variant="outlined" onChange={(e) => setEditEmpTypeName(e.target.value)} value={editEmpTypeName} />:
                                    <TextField error id="outlined-error" label="Error" variant="outlined" onChange={(e) => setEditEmpTypeName(e.target.value)} value={editEmpTypeName} />
                                }
                                <Button variant="text" onClick={() => {handleModalEditButton()}}>Edit</Button>
                                {errMsgEditEmpTypeName ? 
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

export default ViewEmployeeTypes
