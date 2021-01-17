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
import NativeSelect from '@material-ui/core/NativeSelect';

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
  
  const [libros, setLibros] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [prestamos, setPrestamos] = useState([])


  useEffect(() => {
    cargarLibros();
    cargarUsuarios();
    cargarPrestamos();
  }, []);

  const columns = [
    {
      name: 'Codigo libro',
      field: 'codigo'
    },
    {
      name: 'Rut persona',
      field: 'rut'
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
    axios.post("http://localhost:9000/api/prestamo", data)
    .then(response => {
        if (response.status == 200) {
          alert("Usuario registrado exitosamente!!")
          cargarLibros();
          reset();
        }
      }
    )
    .catch(error => { console.log(error); });
  }
  const cargarLibros = async () => {
    const { data } = await axios.get("http://localhost:9000/api/libroautor");
    setLibros(data.libroConAutor);
  };

  const cargarPrestamos = async () => {
    const { data } = await axios.get("http://localhost:9000/api/prestamo");
    setPrestamos(data.resultado);
  };

  const cargarUsuarios = async () => {
    const { data } = await axios.get("http://localhost:9000/api/personas");
    setUsuarios(data.persona);
  };

  const personaOptions = () => {
    return usuarios.reduce((acum, usuario) => acum.concat(<option value={usuario._id}>{usuario.rut}</option>), [])
  };

  const libroOptions = () => {
    return libros.reduce((acum, libro) => acum.concat(<option value={libro._id}>{libro.nombre}</option>), [])
  };

  const items = () => {
    return prestamos.reduce((acum, prestamo) => acum.concat({
      codigo: prestamo.libro?prestamo.libro.codigo:'sin libro',
      rut: prestamo.persona?prestamo.persona.rut:'sin persona'
    }), []);
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h4">
          Formualrio de prestamos
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <label>Libro: </label>
              <NativeSelect name="libro" inputRef={register}>
                <option value="">None</option>
                {libroOptions()}
              </NativeSelect>
            </Grid>
            <Grid item xs={12} sm={6}>
              <label>Rut persona: </label>
              <NativeSelect name="persona" inputRef={register}>
                <option value="">None</option>
                {personaOptions()}
              </NativeSelect>
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
              Lista de Prestamos
            </Typography>
          <Grid container spacing={1} lg={12}>
            <MaterialDatatable
              title={"Prestamos"}
              data={items()}
              columns={columns}
              options={options}
            />
          </Grid>
        </form>
      </div>
    </Container>
  );
}