import React from 'react';
import ChatWindow from "./components/ChatWindow";
import {Grid, ThemeProvider, Typography} from "@mui/material";
import {theme} from "./utils/Theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Grid container alignItems={'center'} alignContent={'center'} direction={'column'}>
        <Grid item>
          <Typography variant={'h2'} sx={{marginTop: 2}}>Azure SQL Chat GPT</Typography>
        </Grid>
        <Grid item>
          <ChatWindow/>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
