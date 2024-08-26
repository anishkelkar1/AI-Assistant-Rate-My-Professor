import { TextField, Button, Box, Stack } from "@mui/material";
import { useState } from "react";

export default function SendLink({ setIsLoading, setMessages }) {

    const [link, setLink] = useState('')

    // const handleKeyPress = (event) => {
    //     if (event.key === "Enter" && !event.shiftKey) {
    //         event.preventDefautl()
    //         sendURl()
    //     }
    // }
    const sendURl = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/link", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url: link }),
            });
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }

            const data = await response.json();

            setMessages((prevMessages) => [
                ...prevMessages,
                { role: "assistant", content: data.message },
            ]);
        } catch (error) {

            console.error("Error submitting link:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    role: "assistant",
                    content: "An error occurred while processing the link.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
            <Stack direction={'row'} spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, width: '50%', }}>
                <TextField
                    fullWidth
                    label='Enter Rate My Professor URL'
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                // onKeyDown={handleKeyPress}
                >
                </TextField>
                <Box>
                    <Button
                        width
                        variant="contained"
                        onClick={sendURl}
                    >
                        Submit Url
                    </Button >

                </Box>

            </Stack >
        </>

    )
}
