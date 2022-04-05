import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getProviders, signIn, getSession, getCsrfToken } from 'next-auth/react';
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router'


const theme = createTheme();

export default function SignIn({ providers, csrfToken }) {

    const router = useRouter()
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const submit = async (event) => {
        event.preventDefault();
        const data = await signIn("credentials", {
            callbackUrl: `${window.location.origin}/transactions`,
            redirect: false,
            email,
            password
        })

        if (data.status == 200) {
            router.push('/transactions')
            toast('Successfully signed in')
        } else {
            toast('Incorrect email or password')
        }


    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Toaster />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box
                        onSubmit={submit}
                        component="form"
                    // action=f"/api/auth/callback/credentials">
                    >
                        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}



SignIn.getInitialProps = async (context) => {
    const { req, res } = context;
    const session = await getSession(context);
    // if (session && res && session.accessToken) {
    //     res.writeHead(302, { Location: '/' });
    //     res.end();
    //     return
    // }

    return {
        session: undefined,
        providers: await getProviders(),
        csrfToken: await getCsrfToken(context),
    }

}

