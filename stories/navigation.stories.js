import React from "react";
import { HashRouter, Route } from "react-router-dom";
import HeaderNavigation from "../src/js/navigation/header-navigation";
import schemaManager from "../src/js/functions/schema-manager";
import suppliersSchema from "./assets/schemas/suppliers.json";

schemaManager.schema = suppliersSchema;

export default {
  title: 'Diablo components/Navigation'
};

export const header = () => {
  let props = {
    icon: null,
    label: 'CMS',
    className: 'navbar-light bg-light',
    menu: [{
      label: 'Administrador',
      icon: 'user-circle-o',
      path: '/',
      name: 'admin',
      menu: [{
        label: 'ver perfil',
        path: '/perfil',
        name: 'profile'
      },
      {
        component: 'logout',
        name: 'logout'
      }]
    }],
    components: { logout: <span>Cerrar sesión</span> }
  };
  return <HashRouter>
    <HeaderNavigation {...props} />
    <Route path="/">
      an
    </Route>
  </HashRouter>
}