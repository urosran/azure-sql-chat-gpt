import React, {useEffect} from 'react';
import {Fab, Grid, TextField, Typography} from "@mui/material";
import axios from "axios";
import SendIcon from '@mui/icons-material/Send';


const ChatWindow = ({databaseInformation}) => {

  const [messages, setMessages] = React.useState([]);
  const [userQuery, setUserQuery] = React.useState('');
  const [chatGptUserQuery, setChatGptUserQuery] = React.useState(null);

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
        console.log(response.data)
        setMessages(response.data)
        return response.data
      }).catch((error) => {
        console.log(error)
      })
    }

    getMessages()
    // setMessages(messagesLocal)

  }, [chatGptUserQuery])

  function getMessageCard(message) {
    console.log(message)
    switch (message.role) {
      case 'user':
        console.log(message.role)
        return (
          <Grid item sx={{backgroundColor: 'azure', color: 'black'}} xs={12}>
            <Typography variant={'body'}>{message.content}</Typography>
          </Grid>
        )

      case 'assistant':
        const messageContent = JSON.parse(message.content)

        if (messageContent.recipient === 'USER') {
          console.log(messageContent.message)
          return (
            <Grid item sx={{backgroundColor: 'azure', color: 'black'}} xs={12}>
              <Typography variant={'body'}>{messageContent.message}</Typography>
            </Grid>
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
          <TextField id="outlined-basic-email" label="Type Something" fullWidth
                     onChange={e => setUserQuery(e.target.value)}/>
        </Grid>
        <Grid xs={1} align="right">
          <Fab color="primary" aria-label="add" onClick={sendChatGptPrompt}><SendIcon/></Fab>
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
  // {
  //   "role": "user",
  //   "content": "You can address the SQL Server by using the SERVER recipient. When calling the server, you must also specify an action. The action can be QUERY when you want to QUERY the database. The format you will use for executing a query is as follows: {\"recipient\":\"SERVER\", \"action\":\"QUERY\", \"message\":\"SELECT SUM(OrderQty) FROM Sales.SalesOrderDetail;\"}"
  // },
  // {
  //   "role": "user",
  //   "content": "if you need to query the database to answer information you're supposed to write the query in the message part of the JSON as specified earlier and repeated here {\"recipient\":\"SERVER\", \"action\":\"QUERY\", \"message\":\"SELECT SUM(OrderQty) FROM Sales.SalesOrderDetail;\"}"
  // },
  // {
  //   "role": "system",
  //   "content": "you cannot tell the user to execute a query, you must do it yourself by sending a message to the server. like this {\"recipient\":\"SERVER\", \"action\":\"QUERY\", \"message\":\"SELECT SUM(OrderQty) FROM Sales.SalesOrderDetail;\"}"
  // },
  // {
  //   "role": "system",
  //   "content": "you will not tell that the answer is a query for the user such as 'The query for the number of venues is: SELECT COUNT(*) FROM test.dbo.Venues;', you must do it yourself by sending a message to the server like this {\"recipient\":\"SERVER\", \"action\":\"QUERY\", \"message\":\"SELECT SUM(OrderQty) FROM Sales.SalesOrderDetail;\"}"
  // },
  // {
  //   "role": "system",
  //   "content": "you will not tell that the answer is a query for the user such as  'The number of venues we have is: SELECT COUNT(*) FROM test.dbo.Venues;', you must do it yourself by sending a message to the server like this {\"recipient\":\"SERVER\", \"action\":\"QUERY\", \"message\":\"SELECT SUM(OrderQty) FROM Sales.SalesOrderDetail;\"}"
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is: SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "system",
  //   "content": "Please repeat that answer but use valid JSON only like \"recipient\": \"SERVER\", \"action\": \"QUERY\", \"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\" and no other text or explanation. This is not an acceptable answer: 'Here is your answer in valid JSON: {\"recipient\":\"SERVER\", \"action\":\"QUERY\", \"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}'"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "user",
  //   "content": "here is the json with all databases, tables and columns with datatypes: [{\"databaseName\":\"test\",\"tables\":[{\"tableName\":\"Venues\",\"columns\":[{\"columnName\":\"VenueID\",\"dataType\":\"int\"},{\"columnName\":\"VenueName\",\"dataType\":\"varchar\"},{\"columnName\":\"Location\",\"dataType\":\"varchar\"}]}]}]"
  // },
  // {
  //   "role": "user",
  //   "content": "How many venues do we have?"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"SERVER\",\"action\":\"QUERY\",\"message\":\"SELECT COUNT(*) FROM test.dbo.Venues;\"}",
  //   "toolCalls": []
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "user",
  //   "content": "The response you got from the database is:[{\"\":5}]"
  // },
  // {
  //   "role": "assistant",
  //   "content": "{\"recipient\":\"USER\",\"message\":\"The number of venues we have is 5.\"}",
  //   "toolCalls": []
  // }
]