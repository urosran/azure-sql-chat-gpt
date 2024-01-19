import React, {useEffect} from 'react';
import {Fab, Grid, TextField, Typography} from "@mui/material";
import axios from "axios";
import SendIcon from '@mui/icons-material/Send';


const ChatWindow = ({databaseInformation}) => {

  const [messages, setMessages] = React.useState([]);

  useEffect(() => {
    async function getMessages() {
      //todo get messages from azure sql
      axios({
        method: "POST",
        url: 'http://localhost:5000/allDbsAndSchemas',
        data: {
          dbInformation: {databaseInformation},
          messageHistory: {messages}
        }
      }).then((response) => {
        console.log(response.data)
        setMessages(response.data)
        return response.data
      }).catch((error) => {
        console.log(error)
      })
    }

    getMessages()

  }, [])

  function getMessageCard(message) {
    switch (message.type) {
      case 'user':
        return (
          <Grid item sx={{backgroundColor: 'azure', color: 'white'}}>
            <Typography variant={'body'}>{message}</Typography>
          </Grid>
        )

      case 'assistant':
        return (
          <Grid item sx={{backgroundColor: 'dimgray', color: 'white'}}>
            <Typography variant={'body'}>{message}</Typography>
          </Grid>
        )
    }
  }

  return (
    <Grid container direction={'column'}
          sx={{
            width: '80vw',
            padding: 2,
            border: 1,
            borderWidth: '1px',
            borderRadius: 5,
            backgroundColor: 'whitesmoke',
            minHeight: '80vh'
          }}>
      <Grid item container sx={{width: '100%', minHeight: '70vh', overflow: 'hidden'}} xs={12}>
        {messages.map(message => {
          return (
            getMessageCard(message)
          )
        })}
      </Grid>
      {/*<Divider/>*/}
      <Grid item container sx={{width: '100%', position: 'sticky', bottom: 'inherit', left: 'inherit'}}>
        <Grid item xs={10} sx={{width: '90%', marginRight: 2}}>
          <TextField id="outlined-basic-email" label="Type Something" fullWidth/>
        </Grid>
        <Grid xs={1} align="right">
          <Fab color="primary" aria-label="add"><SendIcon/></Fab>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default ChatWindow;
