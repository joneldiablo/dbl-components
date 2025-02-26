
import { parse  } from 'react-docgen';
import PropTypes from 'prop-types';
import jsdom from 'jsdom';


const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document, navigator, Element } = window;
global.window = window;
global.document = document;
global.navigator = navigator;
global.Element = Element;



const main = async () => {
  try {
    const components = await import('../src/js/components.js');
    const docs = Object.entries(components.default.default)
      .map(([key, C]) => {
        console.log('KEYS', key, C.propTypes)
        Object.entries(C.propTypes).forEach(([kp, pt]) => {
          console.log(key, kp, DocumentationBuilder(), pt.isRequired);
        });
      });
    console.log(docs);
  } catch (error) {
    console.error(error);
  }
}

main();