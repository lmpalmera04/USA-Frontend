import React from 'react';

import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';

import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
} from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.css';

import Products from './Products';

export default function App() {
  return (
    <BrowserRouter>
      <Container>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="/">A tiro de As</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Inicio</Nav.Link>
                <Nav.Link href="/products">Productos</Nav.Link>
                <NavDropdown title="Catálogo" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/products/available/by-name/like">Filtrar por nombre</NavDropdown.Item>
                  <NavDropdown.Item href="/products/available/by-category">Filtrar por categoría</NavDropdown.Item>
                  <NavDropdown.Item href="/products/available/by-price/less-than-or-equal-to">Filtrar por precio</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Switch>
          <Route exact path="/" />
          <Route exact path="/products">
            <Products />
          </Route>
          <Route exact path="/products/available/by-name/like">
            <Products filter="by-name" criteria="like" status="available" />
          </Route>
          <Route exact path="/products/available/by-category">
            <Products filter="by-category" status="available" />
          </Route>
          <Route exact path="/products/available/by-price/less-than-or-equal-to">
            <Products filter="by-price" criteria="less-than-or-equal-to" status="available" />
          </Route>
        </Switch>
        <footer>
        <div>Iconos diseñados por <a href="https://www.flaticon.es/autores/good-ware" title="Good Ware">Good Ware</a> de <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es</a></div>
        </footer>
      </Container>
    </BrowserRouter>
  );
}