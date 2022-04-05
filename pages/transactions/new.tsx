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
import prisma from '../../lib/prisma';
import { useRouter } from 'next/router'
import { useSession } from "next-auth/react"

function NewTransaction(props): React.ReactElement {
    const router = useRouter()
    const { data: session, status } = useSession()
    console.log(props)
    React.useEffect(() => {
        if (props.myUser != undefined) {
            return
        } else {
            router.push("/signIn")
        }
        // console.log(props.session)
    })

    const users = props.persons.filter(e => e.email != (props.myUser && props.myUser.email))
    const [currency, setCurrency] = React.useState<string>('USD')
    const [targetCurrency, setTargetCurrency] = React.useState<string>('USD')
    const [transferAmount, setTransferAmount] = React.useState<number>(1.0)
    const [receiver, setReceiver] = React.useState(users.length != 0 && users[0].id)
    const [accounts, setAccounts] = React.useState(users)

    const [converted, setConverted] = React.useState("0.0")
    const [name, setName] = React.useState(users.length != 0 && users[0].name)

    const startTransaction = async (event) => {
        event.preventDefault()
        const balance = { data: props.account }
        const transfer = transferAmount

        if (transferAmount <= 0) {
            toast("Invalid Input")
            return
        }

        if (currency === "USD" && balance.data.dollar < transfer) {
            toast('Insufficient Balance')
            return
        } else if (currency === "GBP" && balance.data.pound < transfer) {
            toast('Insufficient Balance')
            return
        } else if (currency === "JPY" && balance.data.yen < transfer) {
            toast('Insufficient Balance')
            return
        }

        let getRate = (targetCurrency): number => {
            if (targetCurrency == "USD") {
                if (currency == "GBP") {
                    return 1.31
                } else if (currency == "JPY") {
                    return 0.0081
                } else {
                    return 1
                }
            }

            if (targetCurrency == "GBP") {
                if (currency == "USD") {
                    return 0.76
                } else if (currency == "JPY") {
                    return 0.0062
                } else {
                    return 1
                }
            }

            if (targetCurrency == "JPY") {
                if (currency == "USD") {
                    return 122.82
                } else if (currency == "GBP") {
                    return 161.40
                } else {
                    return 1
                }
            }
        }

        const amount = getRate(targetCurrency) * transfer

        axios.post('/api/transaction', {
            currency: currency,
            targetCurrency: targetCurrency,
            converted: amount,
            receiver: receiver,
            amount: transferAmount,
            rate: getRate(targetCurrency),
            pure: transfer

        }).then(res => {
            if (res.status === 200) {
                toast('Transaction Successful')
                router.push("/transactions")
            } else {
                toast('Something went wrong, try refreshing the page')
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
            value: 'GBP',
            label: '£ Pound',
        },
        {
            value: 'JPY',
            label: '¥ JPY',
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
                                            required
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
                                            required
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
                                                setConverted(event.target.value)
                                            }}
                                            id="outlined-basic"
                                            label="Transfer amount"
                                            InputProps={{ inputProps: { min: 1.0 } }}
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
                                            required
                                            label="Receiver"
                                            value={receiver}
                                            onChange={(event) => {
                                                setReceiver(event.target.value)
                                                setName(accounts.filter(a => a.id == a.id)[0].name)
                                            }}
                                            fullWidth
                                        >
                                            {accounts.map((option) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    {option.name}
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
                                <Typography sx={{}} variant="subtitle2" component="p" gutterBottom>To:
                                    {name}
                                </Typography> <br />
                                <Typography sx={{}} variant="subtitle2"
                                    gutterBottom>
                                    Amount:
                                    {converted}
                                </Typography>
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
    const session = await getSession(context);
    if (session) {
        const user = await prisma.user.findFirst({
            where: {
                email: session.user.email
            },
            select: {
                id: true
            }
        })
        const account = await prisma.account.findUnique({
            where: {
                userId: user.id,
            },
            select: {
                userId: true,
                yen: true,
                pound: true,
                dollar: true
            }
        });

        const persons = await prisma.user.findMany({
            select: {
                name: true,
                email: true,
                id: true,
            }
        });

        return {
            props: {
                // person,
                persons,
                // ,
                account,
                myUser: session.user
            }
        }
    } else {
        return {
            props: {
                persons: [],
                account: {},
                myUser: null
            }
        }
    }
}
