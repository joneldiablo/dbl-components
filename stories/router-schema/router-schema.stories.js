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
      view: "debug",
      name: "home",
      content: "Hola root, inicio"
    },
    {
      path: "/mundo",
      view: "debug",
      name: "mundo",
      content: "Hola mundo, path único"
    },
    {
      path: "/mundo/inside",
      view: "debug",
      name: "mundo-inside",
      content: "inside the world"
    },
    {
      path: ["/otra", "/ruta"],
      view: "debug",
      name: "otra-ruta",
      content: "dos rutas, misma vista"
    },
    {
      path: "/sub-routes",
      view: "debug",
      name: "sub-routes",
      content: "ruta con sub rutas más default",
      routes: [
        {
          path: "/",
          view: "debug",
          name: "Default",
          content: "Hijo default"
        },
        {
          path: "inside-1",
          view: "debug",
          name: "inside-1",
          content: "contenido dentro 1"
        },
        {
          path: "inside-2",
          view: "debug",
          name: "inside-2",
          content: "contenido dentro 2"
        }
      ]
    },
    {
      path: "/sub-routes-sin-default",
      view: "debug",
      name: "sub-routes-sin-default",
      content: "path: alguna ruta",
      routes: [
        {
          path: "inside-1",
          view: "debug",
          name: "inside-1",
          content: "contenido dentro 1"
        },
        {
          path: "inside-2",
          view: "debug",
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
      view: "default",
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
      view: "default",
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
      view: "default",
      name: "template",
      childrenIn: "view-container",
      content: [
        {
          component: "NavbarContainer",
          name: "header",
          content: [
            {
              component: "BrandComponent",
              name: "brand",
              content: "Logo",
              logo,
              brand: "MangiBone",
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
          view: "default",
          name: "home",
          content: "contenido de la página en esta <b>string</b>"
        },
        {
          path: "/products",
          view: "default",
          name: "home",
          content: "vamonos a los productos perro!!!"
        }
      ]
    }
  ]
};

export const MangiBoneTest = DefaultViewDemo.bind({});
MangiBoneTest.args = {
  routes: [
    {
      path: "/",
      view: "test",
      name: "template",
      childrenIn: "views",
      style: {
        height: 'calc(100vh - 3px)'
      },
      content: [
        {
          component: "NavbarContainer",
          name: "header-bar",
          content: [
            {
              component: "BrandComponent",
              name: "brand",
              content: "Logo",
              logo,
              brand: "MangiBone",
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
          component: "NavbarContainer",
          name: "search-bar",
          content: "search here",
          classes: 'bg-dark shadow-sm text-white text-right'
        },
        {
          component: "Container",
          name: "views",
          fullWidth: true
        },
        {
          component: "Footer",
          name: "footer",
          content: 'footer'
        }
      ],
      routes: [
        {
          path: "/",
          view: "test",
          name: "home",
          content: [
            {
              name: "hero-video",
              component: "Hero",
              content: "hero here",
              style: {
                height: 300
              }
            },
            {
              component: 'Container',
              name: 'home-content',
              fluid: false,
              content: [
                {
                  name: "about-us",
                  component: "GridContainer",
                  gutter: 'g-0',
                  content: [
                    {
                      component: "Container",
                      name: "about-us-description",
                      content: "sobre nosotros",
                      fullWidth: true
                    }, {
                      component: "ImageContainer",
                      name: "about-us-image",
                      content: "imagen sobre nosotros"
                    }
                  ]
                },
                {
                  component: "Container",
                  name: "the-team",
                  fullWidth: true,
                  content: [
                    {
                      component: "Title",
                      name: "titulo-team",
                      content: "El equipo"
                    },
                    {
                      name: "grid-team",
                      component: "GridContainer",
                      gutter: 'g-4',
                      content: [
                        {
                          component: 'CardContainer',
                          name: 'angel',
                          content: 'Ángel'
                        },
                        {
                          component: 'CardContainer',
                          name: 'chimuelo',
                          content: 'El Chimuelo'
                        },
                        {
                          component: 'CardContainer',
                          name: 'davicho',
                          content: 'Davicho'
                        }
                      ]
                    },
                  ]
                },
                {
                  name: "services",
                  component: "Grid",
                  content: "services here"
                },
                {
                  name: "contact",
                  component: "Container",
                  content: "contact and map here"
                }
              ]
            }
          ]
        },
        {
          path: "/products",
          view: "test",
          name: "home",
          content: "vamonos a los productos perro!!!"
        }
      ]
    }
  ]
};