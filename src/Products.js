import React from 'react';

import {
  Alert,
  Button,
  ButtonGroup,
  FormCheck,
  FormControl,
  FormSelect,
  Table,
} from 'react-bootstrap';

import './Products.css';

const api = 'http://localhost:9000/api';

export default function Products(properties) {
  let crudEnable = true, endpoint = 'products', title = 'Listado de productos', errors = [];
  if (properties.status) {
    crudEnable = false;
    switch (properties.status) {
      default:
        errors.push(<Alert variant="danger">Error: estado inválido.</Alert>);
        break;
      case 'available':
        title += ' disponibles';
        endpoint += '/' + properties.status;
        break;
    }
  }
  if (properties.filter) {
    crudEnable = false;
    switch (properties.filter) {
      default:
        errors.push(<Alert variant="danger">Error: filtro inválido.</Alert>);
        break;
      case 'by-name':
        title += ' por nombre';
        endpoint += '/' + properties.filter;
        break;
      case 'by-category':
        title += ' por categoria';
        endpoint += '/' + properties.filter;
        break;
      case 'by-price':
        title += ' por precio';
        endpoint += '/' + properties.filter;
        break;
    }
    if (properties.criteria) {
      switch (properties.criteria) {
        default:
          errors.push(<Alert variant="danger">Error: criterio inválido.</Alert>);
          break;
        case 'equal-to':
          title += ' igual a';
          endpoint += '/' + properties.criteria;
          break;
        case 'like':
          title += ' como';
          endpoint += '/' + properties.criteria;
          break;
        case 'less-than-or-equal-to':
          title += ' menor o igual a';
          endpoint += '/' + properties.criteria;
          break;
      } 
    } else {
      title += ' igual a';
    }
  }
  const [productsError, setProductsError] = React.useState(null);
  const [productsLoaded, setProductsLoaded] = React.useState(false);
  const [productsData, setProductsData] = React.useState([]);
  const [categoriesError, setCategoriesError] = React.useState(null);
  const [categoriesLoaded, setCategoriesLoaded] = React.useState(false);
  const [categoriesData, setCategoriesData] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [id, setId] = React.useState(null);
  const [category, setCategory] = React.useState('');
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [stock, setStock] = React.useState('');
  const [available, setAvailable] = React.useState(true);
  const [image, setImage] = React.useState('');
  React.useEffect(() => {
    fetch(api + '/products/categories', {
      'method': 'GET',
      'mode': 'cors'
    })
    .then(response => response.json())
    .then(
      result => {
        setCategoriesLoaded(true);
        setCategoriesData(result.sort());
      },
      error => {
        setCategoriesLoaded(true);
        setCategoriesError(error);
      }
    )
    fetch(api + '/' + (search ? endpoint + '/' + search : 'products'), {
      'method': 'GET',
      'mode': 'cors'
    })
    .then(response => response.json())
    .then(
      result => {
        setProductsLoaded(true);
        setProductsData(result);
      },
      error => {
        setProductsLoaded(true);
        setProductsError(error);
      }
    )
  }, [search, endpoint]);
  return (
    <>
      <h5>{title}:</h5>
      {
        {
          'by-name': (<FormControl onChange={event => setSearch(event.target.value)} placeholder="Nombre" type="text" value={search} />),
          'by-category':categoriesError
            ? (<Alert variant="danger">Error: {productsError.message}</Alert>)
            : !categoriesLoaded ? (<Alert variant="info">Cargando...</Alert>)
            : (
              <FormSelect aria-label="Seleccione una categoría" onChange={event => setSearch(event.target.value)} defaultValue="">
                <option value="">Todas las categorías</option>
                {
                  categoriesData.map(
                    (item, index) => (
                      <option key={index}>{item}</option>
                    )
                  )
                }
              </FormSelect>
            ),
          'by-price': (<FormControl onChange={event => setSearch(+event.target.value || '')} placeholder="Precio" type="text" value={search} />),
        }[properties.filter]
      }
      <br />
      {
        productsError
          ? (<Alert variant="danger">Error: {productsError.message}</Alert>)
          : !productsLoaded
            ? (<Alert variant="info">Cargando...</Alert>)
            : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th width="12%" scope="col">Imagen</th>
                      <th width="12%" scope="col">Categoría</th>
                      <th width="12%" scope="col">Nombre</th>
                      <th width="24%" scope="col">Descripción</th>
                      <th width="10%" scope="col">Precio</th>
                      <th width="10%" scope="col">Cantidad</th>
                      <th width="8%" scope="col">Disponible</th>
                      { crudEnable ? (<th width="12%" scope="col">Acciones</th>) : null }
                    </tr>
                    {
                      crudEnable
                        ? (
                          <tr>
                            <td><FormControl onChange={event => setImage(event.target.value)} placeholder="Imagen" type="text" value={image} /></td>
                            <td><FormControl onChange={event => setCategory(event.target.value)} placeholder="Categoría" type="text" value={category} /></td>
                            <td><FormControl onChange={event => setName(event.target.value)} placeholder="Nombre" type="text" value={name} /></td>
                            <td><FormControl onChange={event => setDescription(event.target.value)} placeholder="Descripción" type="text" value={description} /></td>
                            <td><FormControl onChange={event => setPrice(event.target.value)} placeholder="Precio" type="text" value={price} /></td>
                            <td><FormControl onChange={event => setStock(event.target.value)} placeholder="Cantidad" type="text" value={stock} /></td>
                            <td><FormCheck onChange={event => setAvailable(event.target.checked)} defaultChecked={available} /></td>
                            <td>
                              <ButtonGroup aria-label="Acciones">
                                <Button onClick={
                                  event => {
                                    if (!/^\s*$/.test(category) && !/^\s*$/.test(name) && !/^\s*$/.test(description) && +price > 0 && +stock >= 0) {
                                      let item = {id, category, name, description, price, stock, available, image};
                                      fetch(api + '/products', {
                                        'body': JSON.stringify(item),
                                        'headers': {
                                          'Content-Type': 'application/json'
                                        },
                                        'method': 'POST',
                                        'mode': 'cors'
                                      })
                                      .then(response => response.json())
                                      .then(result => {
                                        setId(null);
                                        setCategory('');
                                        setName('');
                                        setDescription('');
                                        setPrice('');
                                        setStock('');
                                        setAvailable(true);
                                        setImage('');
                                        setProductsData(productsData.filter(item => item.id !== id).concat([result]));
                                      });
                                    } else {
                                      window.alert('Complete el formulario correctamente.');
                                    }
                                  }
                                } variant="success">Guardar</Button>
                                <Button onClick={
                                  event => {
                                    setId(null);
                                    setCategory('');
                                    setName('');
                                    setDescription('');
                                    setPrice('');
                                    setStock('');
                                    setAvailable(true);
                                    setImage('');
                                  }
                                } variant="danger">Cancelar</Button>
                              </ButtonGroup>
                            </td>
                          </tr>
                        )
                        : null
                    }
                  </thead>
                  <tbody>
                    {
                      productsData.sort((a, b) => a.id - b.id).map(
                        (item, index) => (
                          <tr key={index}>
                            <td><img alt={item.name} src={item.image || '/box128.png'} width="100%" /></td>
                            <td>{item.category}</td>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>${item.price}</td>
                            <td>{item.stock}</td>
                            <td>{item.available ? 'Si' : 'No'}</td>
                            {
                              crudEnable
                              ? (
                                <td>
                                  <ButtonGroup aria-label="Acciones">
                                    <Button onClick={
                                      event => {
                                        setId(item.id);
                                        setCategory(item.category);
                                        setName(item.name);
                                        setDescription(item.description);
                                        setPrice(item.price);
                                        setStock(item.stock);
                                        setAvailable(item.available);
                                        setImage(item.image);
                                      }
                                    } variant="primary">Editar</Button>
                                    <Button onClick={
                                      event => {
                                        if (window.confirm('¿Realmente desea eliminar el producto "' + item.name + '" perteneciente la categoría "' + item.category + '"?')) {
                                          fetch(api + '/products/' + item.id, {
                                            'method': 'DELETE',
                                            'mode': 'cors'
                                          }).then(() => {
                                            let result = productsData.slice();
                                            result.splice(index, 1);
                                            setProductsData(result);
                                          });
                                        }
                                      }
                                    } variant="danger">Borrar</Button>
                                  </ButtonGroup>
                                </td>
                              )
                              : null
                            }
                          </tr>
                        )
                      )
                    }
                  </tbody>
                </Table>
              )
      }
    </>
  );
}