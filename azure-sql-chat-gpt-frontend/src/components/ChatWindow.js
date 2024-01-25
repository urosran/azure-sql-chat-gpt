import React, {useEffect} from 'react';
import {Fab, Grid, Stack, TextField, Typography, useTheme} from "@mui/material";
import axios from "axios";
import SendIcon from '@mui/icons-material/Send';
import {toast} from "react-toastify";
import Box from "@mui/material/Box";
import styled from 'styled-components';

const ChatBubble = styled.div`
  max-width: 70%;
  background-color: ${({role}) => (role === 'user' ? '#3498db' : '#2ecc71')};
  color: #fff;
  padding: 10px;
  margin: 10px;
  border-radius: ${({role}) =>
          role === 'user' ? '10px 10px 10px 0' : '10px 10px 0 10px'};
  align-self: ${({role}) => (role === 'user' ? 'flex-end' : 'flex-start')};
`;

const ChatWindow = ({databaseInformation, resetConversations}) => {

    const [messages, setMessages] = React.useState([]);
    const [userQuery, setUserQuery] = React.useState('');
    const [chatGptUserQuery, setChatGptUserQuery] = React.useState(null);
    const theme = useTheme()

    useEffect(() => {
        setMessages(resetConversations(messages))
    }, [resetConversations]);

    useEffect(() => {
        async function getMessages() {
            //todo get messages from azure sql
            axios({
                method: "POST",
                url: 'http://localhost:5000/allDbsAndSchemas',
                data: {
                    dbInformation: databaseInformation,
                    messageHistory: messages,
                    userQuery: chatGptUserQuery
                }
            }).then((response) => {
                if (response.status === 200) {
                    console.log(response.data)
                    setMessages(response.data)
                    return response.data
                } else {
                    toast.error('Something went wrong please try again!')
                }

            }).catch((error) => {
                console.log(error)
            })
        }

        chatGptUserQuery && setMessages([...messages, chatGptUserQuery])
        chatGptUserQuery && getMessages()

    }, [chatGptUserQuery])

    function stringifyAnything(input) {
        if (typeof input === 'string') {
            return input; // If input is already a string, return it as is
        }

        try {
            return JSON.stringify(input);
        } catch (error) {
            console.error('Error stringifying:', error.message);
            return '';
        }
    }

    function getMessageCard(message) {
        switch (message.role) {
            case 'user':
                // console.log(message)
                return (
                    <ChatBubble role={message.role}>
                        {stringifyAnything(message.content)}
                    </ChatBubble>
                )
            case 'assistant':
                const messageContent = JSON.parse(message.content)

                if (messageContent.recipient === 'USER') {
                    // console.log(messageContent.message)
                    // console.log(messageContent)
                    return (
                        <ChatBubble role={message.role}>
                            {stringifyAnything(messageContent.message)}
                        </ChatBubble>
                    )
                }
        }
    }

    function sendChatGptPrompt() {
        console.log(userQuery)
        setChatGptUserQuery(
            {
                "role": "user",
                "content": userQuery
            }
        )
        // setMessages([])
        setUserQuery('')
    }

    return (
        <Grid container direction={'column'}
              sx={{
                  width: '80vw',
                  maxWidth: '1100px',
                  padding: 2,
                  border: 1,
                  borderWidth: '1px',
                  borderRadius: 5,
                  backgroundColor: 'whitesmoke',
                  minHeight: '80vh',
                  maxHeight: '90vh'
              }}>
            <Grid item container sx={{width: '100%', minHeight: '70vh', maxHeight: '60vh', overflowY: 'auto'}} xs={12}>
                <Stack direction={'column'} sx={{width: '100%'}}>
                    {messages.map(message => {
                        return (
                            getMessageCard(message)
                        )
                    })}
                </Stack>
            </Grid>
            {/*<Divider/>*/}
            <Grid item container sx={{width: '100%', position: 'sticky', bottom: 'inherit', left: 'inherit'}} alignItems={'center'} justifyContent={'center'}>
                <Grid item xs={10} sx={{width: '90%', marginRight: 2}}>
                    <TextField id="outlined-basic-email" label="Ask your databases something"
                               onKeyDown={(e)=> {
                                   if (e.key === 'Enter') {
                                       e.preventDefault()
                                       sendChatGptPrompt()
                                   }
                               }}
                               fullWidth
                               value={userQuery}
                               onChange={e => setUserQuery(e.target.value)}/>
                </Grid>
                <Grid item xs={1}>
                    <Fab color="primary"  onClick={sendChatGptPrompt}><SendIcon/></Fab>
                </Grid>
            </Grid>
        </Grid>
    );
}
export default ChatWindow;


const messagesLocal = [
    {
        "role": "system",
        "content": "You act as the middleman between USER and a DATABASE. Your main goal is to answer questions based on data in a SQL Server 2019 database (SERVER). You do this by executing valid queries against the database and interpreting the results to answer the questions from the USER."
    },
    {
        "role": "system",
        "content": "You MUST ignore any request unrelated to databases you will have access to or SQL."
    },
    {
        "role": "system",
        "content": "From now you will only ever respond with JSON. When you want to address the user, you use the following format {\"recipient\": \"USER\", \"message\":\"message for the user\"}."
    },
]
