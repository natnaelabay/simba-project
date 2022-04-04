import * as React from 'react'
import Container from '@mui/material/Container'
import AppBar from '../../src/components/AppBar'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider';
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function NewTransaction(props): React.ReactElement {

    const [currency, setCurrency] = React.useState<string>('USD')
    const [targetCurrency, setTargetCurrency] = React.useState<string>('USD')
    const [transferAmount, setTransferAmount] = React.useState<number>(0.0)
    const [receiver, setReceiver] = React.useState('USD')

    const startTransaction = async (event) => {
        event.preventDefault()

        const balance = { data: props.account }
        if (currency === "USD" && balance.data.dollar < transferAmount) {
            toast('Insufficient Balance')
            return
        } else if (currency === "GBP" && balance.data.pound < transferAmount) {
            toast('Insufficient Balance')
            return
        } else if (currency === "YEN" && balance.data.yen < transferAmount) {
            toast('Insufficient Balance')
            return
        }

        let getRate = (targetCurrency): number => {
            if (targetCurrency == "USD") {
                if (currency == "GBP") {
                    return 0.5
                } else if (currency == "YEN") {
                    return 120
                } else {
                    return 1
                }
            }

            if (targetCurrency == "GBP") {
                if (currency == "USD") {
                    return 2
                } else if (currency == "YEN") {
                    return 600
                } else {
                    return 1
                }
            }

            if (targetCurrency == "YEN") {
                if (currency == "USD") {
                    return 0.0081
                } else if (currency == "GBP") {
                    return 0.0011
                } else {
                    return 1
                }
            }
        }

        const amount = getRate(targetCurrency) * transferAmount

        axios.post('/api/transaction', {
            currency: currency,
            targetCurrency: targetCurrency,
            transferAmount: transferAmount,
            receiver: receiver,
            amount: amount

        }).then(res => {
            if (res.status === 200) {
                toast('Transaction Successful')
            } else {
                toast('Something went wrong')
            }
        }).catch(err => {
            toast('Something went wrong')
        })
    }

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
            value: 'YEN',
            label: '¥ YEN',
        },
    ];

    return (
        <Container maxWidth="lg">
            <AppBar />
            <Typography style={{ marginTop: "1rem" }} variant="h4">New Transaction</Typography >
            <Toaster />
            <Card sx={{ mt: 2 }}>
                <CardContent>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={startTransaction}
                        sx={{ mt: 3 }}
                    >
                        <Grid container  >
                            <Grid item xs={6}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            id="outlined-select-currency"
                                            select
                                            label="Source Currency"
                                            value={currency}
                                            fullWidth
                                            onChange={(event) => {
                                                setCurrency(event.target.value as string)
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
                                            label="Target Currency"
                                            value={targetCurrency}
                                            fullWidth
                                            onChange={(event) => {
                                                setTargetCurrency(event.target.value)
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
                                            type={"number"}
                                            value={transferAmount}
                                            onChange={(event) => {
                                                setTransferAmount(Number(event.target.value))
                                            }}
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
                                            value={receiver}
                                            onChange={(event) => {
                                                setReceiver(event.target.value)
                                            }}
                                            fullWidth
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
                                            type="submit"
                                            variant="contained">Send</Button>
                                    </Grid>

                                </Grid>
                            </Grid>

                            <Grid item sx={{ border: 1, ml: 10, p: 2 }} xs={4}>
                                <Typography sx={{ mb: 1 }} variant="h4" gutterBottom>Transaction Detail</Typography>
                                <Divider />
                                <div style={{ marginBottom: "1rem" }}></div>
                                <Typography sx={{}} variant="subtitle2" component="p" gutterBottom>To: Michael Belete</Typography> <br />
                                <Typography sx={{}} variant="subtitle2" gutterBottom>Amount: 500 ETB</Typography> <br />
                                <Typography sx={{}} variant="subtitle2" gutterBottom>Date: April 20, 2022</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Container >
    );
}

export default NewTransaction;




export async function getServerSideProps(context) {
    prisma
    // const session = await getSession(context);
    // console.log("---------------------------------")
    // console.log(session.user.email)
    // console.log("---------------------------------")
    // const user = await prisma.user.findFirst({
    //     where: {
    //         email: session.user.email
    //     }
    // });
    // console.log("---------------------------------")
    // console.log(user)
    // console.log("---------------------------------")

    // const person = await prisma.account.findUnique({
    //     where: {
    //         userId: user.id as number,
    //     },
    // });

    // const account = await prisma.account.findMany({
    //     where: {
    //         userId: user.id as number,
    //     },
    // });

    return {
        props: {
            // person,
            // account
        }
    }
}
