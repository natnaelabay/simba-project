import * as React from 'react'
import Container from '@mui/material/Container'
import AppBar from '../../src/components/AppBar'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider';


function NewTransaction(): React.ReactElement {

    const [currency, setCurrency] = React.useState<string>('USD')

    const currencies = [
        {
            value: 'USD',
            label: '$ Dollar',
        },
        {
            value: 'EUR',
            label: '€ Euro',
        },
        {
            value: 'BTC',
            label: '฿ Bitcoin',
        },
        {
            value: 'ETB',
            label: 'ETB ብር',
        }
    ];

    return (
        <Container maxWidth="lg">
            <AppBar />
            <Typography style={{marginTop: "1rem"}} variant="h4">New Transaction</Typography >
            <Card sx={{ mt: 2 }}>
                <CardContent>
                    <Grid container  >
                        <Grid item xs={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-select-currency"
                                        select
                                        label="Target Currency"
                                        value={currency}
                                        fullWidth
                                        onChange={() => {
                                            console.log("handled")
                                        }}
                                    >
                                        {currencies.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-select-currency"
                                        select
                                        label="Source Currency"
                                        value={currency}
                                        fullWidth
                                        onChange={() => {
                                            console.log("handled")
                                        }}
                                    >
                                        {currencies.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                            <Grid container sx={{ mt: 2 }}>
                                <Grid item xs={12} >
                                    <TextField
                                        fullWidth
                                        id="outlined-basic"
                                        label="Transfer amount"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item></Grid>
                            </Grid>
                            <Grid container sx={{ mt: 2 }}>
                                <Grid item xs={12}>
                                    <TextField
                                        id="outlined-select-currency"
                                        select
                                        label="Receiver"
                                        value={currency}
                                        fullWidth
                                        onChange={() => {
                                            console.log("handled")
                                        }}
                                    >
                                        {currencies.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}></Grid>
                                <Grid item sx={{ mt: 2 }} xs={6}>
                                    <Button
                                        fullWidth
                                        variant="contained">Send</Button>
                                </Grid>

                            </Grid>
                        </Grid>

                        <Grid item sx={{ border: 1, ml: 10, p: 2 }} xs={4}>
                            <Typography sx={{ mb: 1 }} variant="h4" gutterBottom>Transaction Detail</Typography>
                            <Divider />
                            <div style={{marginBottom: "1rem"}}></div>
                            <Typography sx={{}} variant="subtitle2" component="p" gutterBottom>To: Michael Belete</Typography> <br />
                            <Typography sx={{}} variant="subtitle2" gutterBottom>Amount: 500 ETB</Typography> <br />
                            <Typography sx={{}} variant="subtitle2" gutterBottom>Date: April 20, 2022</Typography>
                        </Grid>
                    </Grid>

                </CardContent>
            </Card>
        </Container>
    );
}

export default NewTransaction;