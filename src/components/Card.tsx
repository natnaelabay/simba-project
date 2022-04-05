import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import axios from 'axios';

export default function BasicCard(props) {

    return (
        <Card style={{
            backgroundColor: red[400],
            color: 'white',
        }} sx={{ minWidth: 250, maxWidth: 250, mt: 2 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {
                        props.account ?
                            (props.account.currency === 'USD' ?
                                `Dollar $ ` :
                                props.account.currency === "YEN" ?
                                    `JPY ¥ ` :
                                    props.account.currency === "GBP" ?
                                        `Pound £ ` :
                                        "")
                            : "Currency"
                    }
                </Typography>
                <Typography variant="h4">
                    {
                        props.account ? (props.account.currency === 'USD' ?
                            `$ ${props.account.dollar}` :
                            props.account.currency === "YEN" ?
                                `¥ ${props.account.yen}` :
                                props.account.currency === "GBP" ?
                                    `£ ${props.account.pound}` :
                                    "0.0")
                            : "0.0"
                    }
                </Typography>
            </CardContent>
        </Card>
    );
}