import React, {useContext, useEffect, useState} from 'react';
import uuid from 'react-uuid'

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    MenuItem,
    Stack,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import {
    addUpdateQuestionToDb,
    getArrayOfObjectsWithRemovedItem,
    sortArrayByNumericObjectProperty
} from "../../utils/sharedFunctions";
import {getAuth} from "firebase/auth";
import {AppContext} from "../../utils/AppContext";
import {toast} from "react-toastify";
import {enums} from "../../utils/enums";
import {
    ArrowDropDownCircleOutlined,
    CheckBox,
    ControlPointDuplicate,
    Image,
    Input,
    KeyboardVoice,
    LinearScale,
    LocationOn
} from '@mui/icons-material';
import {SurveyVoiceQuestionType} from './components/survey-voice-question-type/survey-voice-question-type';
import {SurveyTextQuestionType} from './components/survey-text-question-type/survey-text-question-type';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import {SurveySectionQuestionType} from "./components/survey-section-question-type/survey-section-question-type";
import MultipleOptionsDraggable from "./components/MultipleOptionsDraggable";
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
import _ from "lodash";
import SliderOptions from "./components/SliderOptions";

const AddDbConnection = ({
                             user,
                             setUser,
                             password,
                             setPassword,
                             server,
                             setServer,
                             database,
                             setDatabase,
                             openModal,
                             setOpenModal
                         }) => {

    return (
        <Dialog open={openModal} aria-labelledby="form-dialog-title" className='add-question-to-survey-modal'
                onBackdropClick={() => setOpenModal(false)}>
            {/*<DialogTitle id="form-dialog-title">{editMode ? "Edit a question" : <strong>Add a segment</strong>}</DialogTitle>*/}
            <DialogContent sx={{minWidth: 300, width: 600, marginTop: 2}}>
                <Stack direction='column'>
                    <TextField
                        sx={{height: '56px'}}
                        margin="dense"
                        id="question"
                        // label="Question"
                        InputProps={{padding: '10px'}}
                        type="text"
                        fullWidth
                        value={user}
                        onChange={setUser}
                        required
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => setOpenModal(false)} color="secondary">
                    Cancel
                </Button>
                <Button onClick={()=>setOpenModal(false)} variant={'contained'} color={"confirmation"}
                        sx={{backgroundColor: '#1DAEFF'}}>
                    Connect
                </Button>

                {/*{editMode*/}
                {/*&& <Button onClick={handleEditQuestion} sx={{backgroundColor: '#1DAEFF'}}>*/}
                {/*  Edit*/}
                {/*</Button>}*/}
            </DialogActions>
        </Dialog>
    );
}

export default AddDbConnection
