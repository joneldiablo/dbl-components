import React from 'react';
import { HashRouter, Link } from "react-router-dom";
import { RouterSchema } from '../../src/js/react-router-schema';
//import * as ButtonStories from './Button.stories';

export default {
  title: 'Router Schema/hash',
  component: RouterSchema
}
const Template = (args) => (<HashRouter>
  <div style={{display:'flex'}}>
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
      view: {
        name: "Demo /",
        content: "Hola root, inicio"
      }
    },
    {
      path: "/mundo",
      view: {
        name: "Demo /mundo",
        content: "Hola mundo, path único"
      }
    },
    {
      path: "/mundo/inside",
      view: {
        name: "Demo /mundo/inside",
        content: "inside the world"
      }
    },
    {
      path: ["/otra", "/ruta"],
      view: {
        name: "Demo /otra /ruta",
        content: "path: alguna ruta"
      }
    },
    {
      path: "/sub-routes",
      view: {
        name: "Demo /sub-routes",
        content: "path: alguna ruta"
      },
      routes: [
        {
          path: "/",
          view: {
            name: "Default",
            content: "Hijo default"
          }
        },
        {
          path: "inside-1",
          view: {
            name: "Demo /inside-1",
            content: "contenido dentro 1"
          }
        },
        {
          path: "inside-2",
          view: {
            name: "Demo /inside-2",
            content: "contenido dentro 2"
          }
        }
      ]
    },
    {
      path: "/sub-routes-sin-default",
      view: {
        name: "Demo /sub-routes",
        content: "path: alguna ruta"
      },
      routes: [
        {
          path: "inside-1",
          view: {
            name: "Demo /inside-1",
            content: "contenido dentro 1"
          }
        },
        {
          path: "inside-2",
          view: {
            name: "Demo /inside-2",
            content: "contenido dentro 2"
          }
        }
      ]
    }
  ],
  views: []
};