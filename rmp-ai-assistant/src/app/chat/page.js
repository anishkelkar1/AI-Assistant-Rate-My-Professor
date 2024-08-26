'use client'
import { AppBar, Avatar, Box, Button, Stack, Toolbar, TextField, CssBaseline, Typography } from '@mui/material'
import { useState, useRef, useEffect } from 'react'

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)


  const sendMessage = async () => {
    if (!message.trim()) return;  // Don't send empty messages
    setIsLoading(true)

    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])

    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let result = ''

      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
        setIsLoading(false)
        return reader.read().then(processText)
      })
    })
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
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
      }}
      >
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
      <Stack
        direction={'column'}
        width="85vw"
        height="80vh"
        border="1px solid black"
        borderRadius="10px"
        bgcolor='#fff'
        p={3}
        spacing={3}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              {message.role === 'assistant' && (
              <Avatar
                sx={{ mr: 1, mt: 1, width: 40, height: 40 }}
              >R</Avatar>
              )}
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'black'
                    : 'primary.main'
                }
                color="white"
                borderRadius={12}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef}></div>

        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}

          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}

          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
      <CssBaseline />
    </Box>
  )
}
