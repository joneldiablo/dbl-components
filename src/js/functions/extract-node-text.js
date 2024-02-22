import React from "react";

const extractNodeString = (obj) => {
  if (typeof obj === 'string') return obj;
  else if (Array.isArray(obj)) {
    return obj.map(e => extractNodeString(e)).filter(n => !!n).flat().join(' ');
  } else if (React.isValidElement(obj)) {
    return extractNodeString(obj.props.children);
  } else if (!obj) return '';
  return obj.toString();
}

module.exports = extractNodeString;