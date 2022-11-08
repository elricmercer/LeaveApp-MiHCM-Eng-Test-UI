import React, { useEffect, useRef } from 'react'
import SidePanel from '../Components/SidePanel'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useState } from 'react';
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Modal, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';

function ViewEmployees() {
    document.title = "View Employees"

    const effectRan = useRef(false)

    const [empProfileData, setEmpProfileData] = useState([])
    const [empTypeData, setEmpTypeData] = useState([])

    const [newNumber, setNewNumber] = useState('')
    const [newEmployeeCode, setNewEmployeeCode] = useState(0)
    const [newFullname, setNewFullname] = useState('')
    const [valNewFullname, setValNewFullname] = useState(true)
    const [newEmployeeTypeCode, setNewEmployeeTypeCode] = useState(0)
    const [newReportingPersonCode, setNewReportingPersonCode] = useState(0)

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [errMsgEditEmp, setErrMsgEditEmp] = useState(false)

    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [failedToDelete, setFailedToDelete] = useState(false)

    useEffect(() => {
        if(effectRan.current === true){
            const getEmployeeProfilesURL = "https://localhost:7011/api/EmployeeProfile/GetEmployeeProfiles"
            const getEmployeeProfiles = async () => {
                try{
                    const response = await axios.get(
                        getEmployeeProfilesURL,
                        {
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    )

                    setEmpProfileData(response?.data)
                }catch(err){}
            }

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
            
            getEmployeeProfiles()
            getEmployeeTypes()
        }

        return () => {
            effectRan.current = true
        }
    }, [])

    useEffect(() => {
        if(newFullname === ""){
            setValNewFullname(false)
        }
        else{
            const regex = /^[a-zA-Z ]+$/
            let validity = regex.test(newFullname)
            setValNewFullname(validity)
        }
    }, [newFullname])


    const employeeTypeName = (props) => {
        let name = ''
        for(let i=0;i<empTypeData.length;i++){
            if(empTypeData[i].employeeTypeCode === props.employeeTypeCode){
                name = empTypeData[i].employeeTypeName
                break
            }
        }

        return name
    }

    const reportingPersonName = (props) => {
        let name = ''
        for(let i=0;i<empProfileData.length;i++){
            if(empProfileData[i].employeeCode === props.reportingPersonCode){
                name = empProfileData[i].number +" "+ empProfileData[i].fullname
                break
            }
        }

        return name
    }

    const handleEditButton = (props) => {
        setNewNumber(props.number)
        setNewEmployeeCode(props.employeeCode)
        setNewFullname(props.fullname)
        setNewEmployeeTypeCode(props.employeeTypeCode)
        setNewReportingPersonCode(props.reportingPersonCode)
        setErrMsgEditEmp(false)
        handleEditOpen(true)
    }

    const handleDeleteButton = (props) => {
        setNewEmployeeCode(props.employeeCode)
        handleDeleteOpen(true)
    }

    const handleEditOpen = () => setEditModalOpen(true);
    const handleEditClose = () => setEditModalOpen(false);

    const handleEmployeeTypeChange = (e) => {
        setNewEmployeeTypeCode(e.target.value)
    }

    const handleReportingPersonChange = (e) => {
        setNewReportingPersonCode(e.target.value)
    }

    const handleModalEditButton = async () => {
        if(valNewFullname === true && newEmployeeCode !== 0 && newNumber !== ""){
            const updateEmployeeURL = "https://localhost:7011/api/EmployeeProfile/UpdateEmployeeProfile"
            const updateEmployee = async () => {
                try{
                    const response = await axios.put(
                        updateEmployeeURL,
                        {
                            employeeCode: newEmployeeCode,
                            number: newNumber,
                            fullname: newFullname,
                            employeeTypeCode: newEmployeeTypeCode,
                            reportingPersonCode: newReportingPersonCode,
                            updatedBy: JSON.parse(localStorage.getItem("loggedInAs")) || 0
                        },
                        {
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    )

                    window.location.reload()
                }catch(err){
                    setErrMsgEditEmp(true)
                }
            }

            updateEmployee()
        }
        else{
            setErrMsgEditEmp(true)
        }
    }

    const handleDeleteOpen = () => setDeleteModalOpen(true);
    const handleDeleteClose = () => setDeleteModalOpen(false);

    const handleModalDeleteButton = async () => {
        if(newEmployeeCode !== 0){
            const deleteEmpURL = "https://localhost:7011/api/EmployeeProfile/DeleteEmployeeProfile"
            try{
                const response = await axios.put(
                    deleteEmpURL,
                    {
                        employeeCode: newEmployeeCode,
                        deleted: true,
                        deletedBy: JSON.parse(localStorage.getItem("loggedInAs")) || 0
                    }
                )

                window.location.reload()
            }catch(err){
                setFailedToDelete(true)
            }
        }
        else{
            setFailedToDelete(true)
        }
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
                <Card sx={{ minWidth: 800 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            View Employees
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 800 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Number</TableCell>
                                        <TableCell>Fullname</TableCell>
                                        <TableCell>Employee Type</TableCell>
                                        <TableCell>Reporting Person</TableCell>
                                        <TableCell align="right">Edit</TableCell>
                                        <TableCell align="right">Delete</TableCell>
                                    </TableRow>
                                </TableHead>
                                    <TableBody>
                                    {empProfileData.map((emp) => (
                                        <TableRow
                                            key={emp.employeeCode}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {emp.number}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {emp.fullname}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {employeeTypeName(emp)}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {reportingPersonName(emp)}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={ () => {handleEditButton(emp)}}
                                                    >
                                                    Edit
                                                </Button>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={ () => {handleDeleteButton(emp)}}
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
                                {valNewFullname ? 
                                    <TextField id="outlined-basic" label="Fullanme" variant="outlined" onChange={(e) => setNewFullname(e.target.value)} value={newFullname} sx={{marginTop: "10px"}} />:
                                    <TextField error id="outlined-error" label="Fullanme" variant="outlined" onChange={(e) => setNewFullname(e.target.value)} value={newFullname} />
                                }
                                <FormControl sx={{ minWidth: 200, marginRight: "5px", marginTop: "20px" }}>
                                    <InputLabel id="employeeType-simple-select-label">Employee Type</InputLabel>
                                    <Select
                                        labelId="employeeType-simple-select-label"
                                        id="employeeType-simple-select"
                                        value={newEmployeeTypeCode}
                                        label="EmployeeType"
                                        onChange={handleEmployeeTypeChange}
                                    >
                                        {empTypeData.map((empType) => (
                                            <MenuItem key={empType.employeeTypeCode} value={empType.employeeTypeCode}>{empType.employeeTypeName}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ minWidth: 200, marginRight: "5px", marginTop: "20px" }}>
                                    <InputLabel id="reportingPerson-simple-select-label">Reporting Person</InputLabel>
                                    <Select
                                        labelId="reportingPerson-simple-select-label"
                                        id="reportingPerson-simple-select"
                                        value={newReportingPersonCode}
                                        label="ReportingPerson"
                                        onChange={handleReportingPersonChange}
                                    >
                                        {empProfileData.map((emp) => (
                                            <MenuItem key={emp.employeeCode} value={emp.employeeCode}>{emp.number} | {emp.fullname}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button variant="text" onClick={() => {handleModalEditButton()}}>Edit</Button>
                                {errMsgEditEmp ? 
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

export default ViewEmployees
