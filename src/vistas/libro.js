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
  const [autores, setAutores] = useState([])

  useEffect(() => {
    cargarLibros();
    cargarAutor();
  }, []);

  const columns = [
    {
      name: 'Codigo',
      field: 'codigo'
    },
    {
      name: 'Nombre',
      field: 'nombre'
    },
    {
      name: 'Autor',
      field: 'autor'
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
    axios.post("http://localhost:9000/api/libro", data)
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

  const cargarAutor = async () => {
    const { data } = await axios.get("http://localhost:9000/api/autor");
    setAutores(data.autor);
  };

  const autorOptions = () => {
    return autores.reduce((acum, autor) => acum.concat(<option value={autor._id}>{autor.nombre}</option>), [])
  };

  const items = () => {
    return libros.reduce((acum, libro) => acum.concat({
      nombre: libro.nombre,
      codigo: libro.codigo,
      autor: libro.autor?libro.autor.nombre : 'sin autor'
    }), []);
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h4">
          Formualrio de libros
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
          <Grid item xs={12}>
              <TextField
                autoComplete="nombre-libro"
                name="nombre"
                variant="outlined"
                required
                fullWidth
                id="nombre"
                label="Nombre"
                autoFocus
                inputRef={register}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="codigo"
                name="codigo"
                variant="outlined"
                required
                fullWidth
                id="codigo"
                label="Código"
                autoFocus
                inputRef={register}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <NativeSelect label="Autor" name="autor" inputRef={register}>
                <option value="">None</option>
                {autorOptions()}
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
              Lista de libros
            </Typography>
          <Grid container spacing={1} lg={12}>
            <MaterialDatatable
              title={"libros"}
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