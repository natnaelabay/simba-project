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

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function BasicTable(props) {

    const { data: session, status } = useSession()  
    const router = useRouter()
    
    if (status === "authenticated") {
        return (
            <>
                <Container maxWidth="lg">
                    <CustomAppBar />
                    <Grid container spacing={2}>
                        <Grid item >
                            <CustomCard />
                        </Grid>
                        <Grid item >
                            <CustomCard />
                        </Grid>
                        <Grid item >
                            <CustomCard />
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
                                    <TableCell>Id</TableCell>
                                    <TableCell align="left">From</TableCell>
                                    <TableCell align="left">To</TableCell>
                                    <TableCell align="left">Value</TableCell>
                                    <TableCell align="left">Currency</TableCell>
                                    <TableCell align="left">Created At</TableCell>
                                    <TableCell align="left">Updated At</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    >
                                        <TableCell align="left">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="left">
                                            {row.name}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.fat}</TableCell>
                                        <TableCell align="right">{row.carbs}</TableCell>
                                        <TableCell align="right">{row.carbs}</TableCell>
                                        <TableCell align="right">{row.carbs}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </>
        );
    }
    else {

    }


}




export async function getServerSideProps({ req, res }) {
    const session = await getSession({ req });
    const user = await prisma.user.findFirst({
        where: {
            email: session.user.email
        }
    })

    const transactions = await prisma.transaction.findMany({
        where: {
            OR: [
                { senderId: user.id },
                { receiverId: user.id }
            ]
        }
    })

    return {
        props: {
            user: {
                name: user.name,
                email: user.email,
                id: user.id
            },
            transactions
        }
    }
}