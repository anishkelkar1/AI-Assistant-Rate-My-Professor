'use client'
import { Box, Button, CssBaseline, AppBar,Toolbar, Typography } from '@mui/material'
import { useState, useRef, useEffect } from 'react'

export default function Home() {
  return(
    <Box 
    width="100vw"
    height="100vh"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    sx={{
      backgroundImage: 'url(/assets/dark-background.jpeg)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
    }}>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
    />
    <AppBar elevation={0} sx={{background:'none'}}>
        <Toolbar >
          <Typography variant="h4" ml={3} style={{ flexGrow: 1 }}
          sx={{
            fontWeight: 1000,
            letterSpacing: 2,
            fontFamily: 'Nunito, sans-serif',
          }}
          >
            RMP
          </Typography>
        </Toolbar>
      </AppBar>
        <Typography variant="h2" component="h1" gutterBottom sx={{
          fontSize: 48,
          fontWeight: 800,
          letterSpacing: 3,
          color: "#fff"
        }}
        >
          Rate My Professor
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom
         sx={{
          fontWeight: 500,
          letterSpacing: 1,
          fontFamily: 'Nunito, sans-serif',
          color: "#fff"
        }}>
          Chat with the RMP AI Assistant!
        </Typography>
        <Button variant="contained"
        sx={{ 
          mt: 2,
          mr: 2,
          fontWeight: 700,
          color: '#000', 
          bgcolor: '#fff', 
          '&:hover': {
            bgcolor: '#e3e3e3'
          },
        }} href="/chat">
          Get Started
        </Button>
        <CssBaseline />
    </Box>
  )
}
