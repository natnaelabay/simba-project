import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CustomAppBar from "../../src/components/AppBar";
import Typography from "@mui/material/Typography";
import CustomCard from "../../src/components/Card";
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import { useSession } from "next-auth/react"
import prisma from '../../lib/prisma';
import { getSession } from "next-auth/react"
import { useRouter } from "next/router";
import axios from 'axios';

export default function BasicTable(props) {

    const { data: session, status } = useSession()
    const router = useRouter()
    const [account, setAccount] = React.useState(props.account)
    console.log(props)
    React.useEffect(() => {
        if (props.myUser) {
            // authenticated
            // axios.get("/api/user/account/" + 10)
            //     .then(res => {
            //         setAccount(res.data)
            //     }).catch(err => {
            //     })
        } else {
            router.push("/signIn")
            return
        }
    }, [])

    const rows = props.transactions
    return (
        <>
            <Container maxWidth="lg">
                <CustomAppBar />
                <Grid container spacing={2}>
                    <Grid item >
                        <CustomCard account={{ ...account, currency: "USD" }} />
                    </Grid>
                    <Grid item >
                        <CustomCard account={{ ...account, currency: "GBP" }} />
                    </Grid>
                    <Grid item >
                        <CustomCard account={{ ...account, currency: "YEN" }} />
                    </Grid>
                </Grid>

                <Divider sx={{ mt: 2 }} />

                <Grid container
                    sx={{ py: 2, }}
                    alignItems="center"
                    justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography variant="h3" component="div">
                            Transactions
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Link href="/transactions/new">
                            <Button variant="contained" color="primary">
                                New Transaction
                            </Button>
                        </Link>
                    </Grid>
                </Grid>

                <Divider sx={{ mb: 2 }} />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Index</TableCell>
                                <TableCell align="left">From</TableCell>
                                <TableCell align="left">To</TableCell>
                                <TableCell align="left">Value</TableCell>
                                <TableCell align="left">Rate</TableCell>
                                <TableCell align="left">Target Currency</TableCell>
                                <TableCell align="left">Source Currency</TableCell>
                                {/* <TableCell align="left">Created At</TableCell>
                                    <TableCell align="left">Updated At</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, i) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell align="left">
                                        {i + 1}
                                    </TableCell>
                                    <TableCell align="left">
                                        {row.sender.id == props.user.id ? "You" : row.sender.name}
                                    </TableCell>
                                    <TableCell align="left">
                                        {row.sender.id == props.user.id ? row.receiver.name : "You"}
                                    </TableCell>
                                    <TableCell style={row.sender.id == props.user.id ? { color: "red" } : {}} align="left">
                                        {row.sender.id == props.user.id ? `-${row.amount}` : `+${row.amount}`}
                                    </TableCell>
                                    <TableCell align="left">{row.rate}</TableCell>
                                    <TableCell align="left">{row.currency}</TableCell>
                                    <TableCell align="left">{row.sourceCurrency}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </>
    );
}




export async function getServerSideProps({ req, res }) {
    const session = await getSession({ req });
    if (session) {
        const user = await prisma.user.findFirst({
            where: {
                email: session.user.email
            }
        })
        const users = await prisma.user.findMany({
            select: {
                name: true,
                id: true,
                email: true
            }
        })

        const account = await prisma.account.findUnique({
            where: {
                userId: user.id
            },
            select: {
                id: true,
                userId: true,
                dollar: true,
                pound: true,
                yen: true,
            }
        })


        let transactions = await prisma.transaction.findMany({
            where: {
                OR: [
                    { senderId: user.id },
                    { receiverId: user.id }
                ]
            },
            select: {
                id: true,
                amount: true,
                senderId: true,
                receiverId: true,
                currency: true,
                rate: true,
                sourceCurrency : true
                // createdAt: true,
            }
        })

        const updated = transactions.map(
            (item, index) => {
                const sender = users.filter(i => i.id == item.senderId)[0]
                const receiver = users.filter(i => i.id == item.receiverId)[0]
                return { receiver, sender, ...item }
            }
        )

        return {
            props: {
                user: {
                    name: user.name,
                    email: user.email,
                    id: user.id
                },
                transactions: updated.reverse(),
                account: account,
                myUser: session.user
            }
        }
    } else {
        return {
            props: {
                user: {},
                transactions: [],
                account: {},
                myUser: null
            }
        }
    }
}