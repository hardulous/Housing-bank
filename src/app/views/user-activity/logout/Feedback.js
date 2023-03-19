import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import './logout.css'
import Slide from '@material-ui/core/Slide';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import { TextField } from '@material-ui/core';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from "formik";
import * as yup from "yup";

import { Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const theme = createTheme({
    typography: {
        // Tell Material-UI what the font-size on the html element is.
        htmlFontSize: 11,
    },
});

export default function Feedback({ user, auth }) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const [starvalue, setStarvalue] = React.useState(2);

    const sendApiData = async (Feedback) => {
        try {
            await Axios.post(
                `/retrieval_service/api/feedback`, JSON.stringify({
                    username: user,
                    starvalue: starvalue,
                    Feedback: Feedback

                }),
                {
                    headers: {
                        Accept: "application/json", 
                        "Content-Type": "application/json; charset=utf8",
                        Authorization: "Bearer " + auth,
                    }
                }
            );
        } catch (e) {
            callMessageOut(e.message);
        }
    };

    const validationSchema = yup.object({

        Feedback: yup.string().required('Please enter your feedback')

    })

    const formik = useFormik({
        initialValues: {
            Feedback: ""
        },

        validationSchema: validationSchema,
        onSubmit: (value) => {
            sendApiData(value),
                toast.success("Thank you  for submitting your feedback");
            handleClose();
        }
    });

    return (
        <>
            <ToastContainer />
            <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
                <div className='feedbackmain' >
                    {/* <div className='feedbackcenter' >
                        <ThemeProvider theme={theme}>
                            <Typography>Thank You For Using Our Services</Typography>
                        </ThemeProvider>
                    </div> */}
                </div>
                <div className='feedbackparent' >
                    <div className='feedbackchild'>
                        <Typography style={{ marginLeft: "1rem", fontSize: "20px" }} >Feedback</Typography>
                        <Toolbar>
                            {/* <IconButton color="inherit" onClick={handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton> */}
                            <Tooltip title={("Close")} aria-label="Close">
                                <IconButton onClick={handleClose} >
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                        </Toolbar>
                    </div>
                    <div className='services' >
                        <Typography style={{ marginLeft: "1rem", fontSize: "16px" }} >How do you like our Service </Typography>
                    </div>
                    <div className='ratingdiv' >
                        <Box component="fieldset" borderColor="transparent">
                            <Rating

                                name="simple-controlled"
                                size='large'
                                value={starvalue}
                                onChange={(event, newValue) => {
                                    setStarvalue(newValue);
                                }}
                            />
                        </Box>
                    </div>
                    <div>
                        <form onSubmit={formik.handleSubmit}  >
                            <Typography style={{ marginLeft: "1rem", fontSize: "13px" }} >Tell us about your experience </Typography>
                            <div style={{ padding: "1rem" }} >
                                <TextField
                                    id="Feedback"
                                    label="Feedback"
                                    multiline
                                    minRows={4}
                                    fullWidth
                                    variant="outlined"
                                    name="Feedback"
                                    value={formik.values.Feedback}
                                    onChange={formik.handleChange}
                                    error={formik.touched.Feedback && Boolean(formik.errors.Feedback)}
                                    helperText={formik.touched.Feedback && formik.errors.Feedback}
                                />
                            </div>
                            <Button style={{ float: "right", margin: "1rem" }} type='submit' variant="contained" color="primary">
                                submit
                            </Button>
                        </form>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
