import PropTypes from "prop-types";

export const ptClasses = PropTypes.oneOfType([
  PropTypes.string, PropTypes.arrayOf(PropTypes.string, PropTypes.arrayOf(PropTypes.string))
]);

export const ptObjClasses = PropTypes.oneOfType([
  ptClasses,
  PropTypes.objectOf(ptClasses)
]);

export const stringNumber = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);
export const objStringNumber = PropTypes.objectOf(stringNumber);