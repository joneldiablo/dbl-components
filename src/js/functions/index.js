import plural from "pluralize-es";

export const normalize = (str) => (str || '').toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const slugify = (str = '') => normalize(str)
  .replace(/\s/g, '-').replace(/[^a-zA-Z\d\-]+/g, '')
  .replace(/-+/g, '-');

export const number = () => null;

export const pluralize = (num, value = '') => {
  if (num == 1) return value;
  switch (value) {
    case 'Kg':
    case 'kg':
      return value + 's';
    case 'L':
    case 'l':
      return value + 'ts';
    default:
      return plural(value);
  }
};

export const price = (value = '') => new Intl.NumberFormat('us-MX', {
  style: 'currency', currency: 'MXN', currencyDisplay: 'symbol'
}).format(value);

export const sanitizedTags = ['b', 'i', 'em', 'strong', 'a', 'small', 'h5', 'h6',
  'blockquote', 'p', 'ul', 'ol', 'nl', 'li', 'strike', 'code', 'hr',
  'br', 'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre'];

export const sanitizedAttributes = { a: ['href', 'target'], '*': ['class', 'style'] };

export const randomS4 = () => {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

export const hash = (string) => {
  var hash = 0, i, chr;
  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export const fixReactRouter = (location, to) => {
  let path = to;
  //FIX: react router tiene un error al navegar de forma relativa
  if (!path.startsWith('/')) {
    const tmp = location.pathname.replace(/\/$/, '').split('/');
    const actual = tmp.pop();
    if (path.startsWith('..')) {
      path = `../${tmp.pop()}/${path.replace(/\.\.\/?/, '')}`;
    } else if (path.startsWith('.')) {
      path = path.replace('.', actual);
    } else {
      path = `./${actual}/${path}`;
    }
  }
  return path;
}

export default {
  normalize,
  slugify,
  number,
  pluralize,
  price,
  sanitizedTags,
  sanitizedAttributes,
  randomS4,
  hash,
  fixReactRouter
};