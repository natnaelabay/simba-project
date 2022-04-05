import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSession } from "next-auth/react"
import { getSession } from "next-auth/react"
import { useRouter } from 'next/router'

const theme = createTheme();

export default function SignIn(props) {
  const { data: session, status } = useSession()
  
  const router= useRouter()
  React.useEffect(() =>{
    if (status === "authenticated") {
      router.push("/transactions")
    } else {
      router.push("/signIn")
    }
  },[])

  return (<></>);
}
