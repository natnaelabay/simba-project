import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';

export default function BasicCard() {

    return (
        <Card style={{
            backgroundColor: red[400],
            color: 'white',
        }} sx={{ minWidth: 250, maxWidth: 250, mt: 2 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    Dollars ($)
                </Typography>
                <Typography color="text.secondary">
                    + $25
                </Typography>
                <Typography variant="h4">
                    $2000
                </Typography>
            </CardContent>
        </Card>
    );
}