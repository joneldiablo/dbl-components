import PropTypes from "prop-types";

export const ptClasses = PropTypes.oneOfType([
  PropTypes.string, PropTypes.arrayOf(PropTypes.string, PropTypes.arrayOf(PropTypes.string))
]);

export const ptObjClasses = PropTypes.oneOfType([
  ptClasses,
  PropTypes.objectOf(ptClasses)
]);