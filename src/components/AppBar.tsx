import * as React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import Avatar from '@mui/material/Avatar';
import { signOut } from "next-auth/react"
import { useRouter } from 'next/router';

export default function CustomAppBar() {
    const router = useRouter()
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => {
                        }}
                    >
                        <CurrencyBitcoinIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        FineTech
                    </Typography>
                    <Typography
                        variant="h6"
                        onClick={async (e) => {
                            const data = await signOut()
                            router.push("/")
                        }}
                        component="button">
                        Logout
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}