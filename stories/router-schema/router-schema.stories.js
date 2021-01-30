import React from 'react';
import { HashRouter, Link } from "react-router-dom";
import { RouterSchema } from '../../src/js/react-router-schema/react-router-schema';
//import * as ButtonStories from './Button.stories';

export default {
  title: 'Router Schema/hash',
  component: RouterSchema
}
const Template = (args) => (<HashRouter>
  <div style={{ display: 'flex' }}>
    <div>
      <ul>
        <li><Link to="/">inicio</Link></li>
        <li><Link to="/mundo">hola mundo</Link></li>
        <li><Link to="/mundo/inside">hola inside</Link></li>
        <li><Link to="/otra">otra ruta</Link></li>
        <li><Link to="/ruta">otra ruta, mismo componente</Link></li>
        <li><Link to="/sub-routes">ruta con sub rutas</Link></li>
        <li><Link to="/sub-routes/inside-1">inside 1</Link></li>
        <li><Link to="/sub-routes/inside-2">inside 2</Link></li>
        <li><Link to="/sub-routes-sin-default">ruta con sub rutas SIN DEFAULT</Link></li>
        <li><Link to="/sub-routes-sin-default/inside-1">inside 1</Link></li>
        <li><Link to="/sub-routes-sin-default/inside-2">inside 2</Link></li>
      </ul>
    </div>
    <div>
      <RouterSchema {...args} />
    </div>
  </div>
</HashRouter>);

export const BasicDemo = Template.bind({});
BasicDemo.args = {
  routes: [
    {
      path: "/",
      view: "Debug",
      name: "home",
      content: "Hola root, inicio"
    },
    {
      path: "/mundo",
      view: "Debug",
      name: "mundo",
      content: "Hola mundo, path único"
    },
    {
      path: "/mundo/inside",
      view: "Debug",
      name: "mundo-inside",
      content: "inside the world"
    },
    {
      path: ["/otra", "/ruta"],
      view: "Debug",
      name: "otra-ruta",
      content: "dos rutas, misma vista"
    },
    {
      path: "/sub-routes",
      view: "Debug",
      name: "sub-routes",
      content: "ruta con sub rutas más default",
      routes: [
        {
          path: "/",
          view: "Debug",
          name: "Default",
          content: "Hijo default"
        },
        {
          path: "inside-1",
          view: "Debug",
          name: "inside-1",
          content: "contenido dentro 1"
        },
        {
          path: "inside-2",
          view: "Debug",
          name: "inside-2",
          content: "contenido dentro 2"
        }
      ]
    },
    {
      path: "/sub-routes-sin-default",
      view: "Debug",
      name: "sub-routes-sin-default",
      content: "path: alguna ruta",
      routes: [
        {
          path: "inside-1",
          view: "Debug",
          name: "inside-1",
          content: "contenido dentro 1"
        },
        {
          path: "inside-2",
          view: "Debug",
          name: "inside-2",
          content: "contenido dentro 2"
        }
      ]
    }
  ]
};

export const DefaultViewDemo = (args) => (<div><RouterSchema {...args} /></div>)
DefaultViewDemo.args = {
  routes: [
    {
      path: "/",
      view: "Default",
      name: "home",
      content: "<span class=\"text-success\">Hola root</span>, <b>inicio</b>"
    }
  ]
};

export const DefaultViewSectionsDemo = DefaultViewDemo.bind({});
DefaultViewSectionsDemo.args = {
  routes: [
    {
      path: "/",
      view: "Default",
      name: "home",
      content: [
        {
          component: "Container",
          name: "article",
          content: "<span class=\"text-success\">Hola root</span>, <b>inicio</b>"
        }
      ]
    }
  ]
};

import logo from "../assets/images/logo.png";
export const MangiBone = DefaultViewDemo.bind({});
MangiBone.args = {
  routes: [
    {
      path: "/",
      view: "Default",
      name: "template",
      childrenIn: "view-container",
      content: [
        {
          component: "NavbarContainer",
          name: "header",
          content: [
            {
              component: "Logo",
              name: "logo",
              image: logo,
              content: "Logo",
              website:"MangiBone",
              slogan: "Come rico, come saludable, come bien"
            },
            {
              component: "NavMenu",
              name: "nav-menu",
              content: "<div class='text-right'>menu</div>",
              menu: []
            }
          ]
        },
        {
          component: "Container",
          name: "view-container"
        },
        {
          component: "Footer",
          name: "footer"
        }
      ],
      routes: [
        {
          path: "/",
          view: "Default",
          name: "home",
          content: "contenido de la página en esta <b>string</b>"
        },
        {
          path: "/products",
          view: "Default",
          name: "home",
          content: "vamonos a los productos perro!!!"
        }
      ]
    }
  ]
};