import React, { useState,useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import MaterialDatatable from "material-datatable";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  delete : {
    backgroundColor:"red"
  }
}));

export default function Autor() {
  const classes = useStyles();

  const { register, handleSubmit, errors, getValues ,setValue, reset } = useForm(
    { defaultValues:{ email: "", pass: "" } });
  
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const columns = [
    {
      name: 'Email',
      field: 'mail'
    }
  ];


  const options={
    selectableRows: false,
    print: false,
    onlyOneRowCanBeSelected: false,
    textLabels: {
      body: {
        noMatch: "Lo sentimos, no se encuentran registros",
        toolTip: "Sort",
      },
      pagination: {
        next: "Siguiente",
        previous: "Página Anterior",
        rowsPerPage: "Filas por página:",
        displayRows: "de",
      },
    },
    download: false,
    pagination: true,
    rowsPerPage: 5,
    usePaperPlaceholder: true,
    rowsPerPageOptions: [5, 10, 25],
    sortColumnDirection: "desc",
  }
  const onSubmit = data => {
    axios.post("http://localhost:9000/api/usuario", data)
    .then(response => {
        if (response.status == 200) {
          alert("Usuario registrado exitosamente!!")
          cargarUsuarios();
          reset();
        }
      }
    )
    .catch(error => { console.log(error); });
  }
  const cargarUsuarios = async () => {
    const { data } = await axios.get("http://localhost:9000/api/usuario");
    setUsuarios(data.data);
  };
  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h4">
          Formualrio de usuarios
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="email"
                name="mail"
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email"
                autoFocus
                inputRef={register}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="password"
                variant="outlined"
                required
                fullWidth
                id="pass"
                label="Contraseña"
                name="pass"
                autoComplete="password"
                inputRef={register}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Crear
          </Button>
            <Typography component="h1" variant="h4">
              Lista de usuarios
            </Typography>
          <Grid container spacing={1} lg={12}>
            <MaterialDatatable
              title={"Usuarios"}
              data={usuarios}
              columns={columns}
              options={options}
            />
          </Grid>
        </form>
      </div>
    </Container>
  );
}