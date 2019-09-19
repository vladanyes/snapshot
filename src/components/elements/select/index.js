import React from 'react';
import PropTypes from 'prop-types';

const Select = props => {
  const { value, onChange, options, placeholder, className } = props;

  const renderOptions = () => {
    let nextOptions = [...options];

    if (placeholder) nextOptions = [placeholder, ...options];

    return nextOptions.map(option => {
      return (
        <option key={option} value={option === placeholder ? '' : option}>
          {option}
        </option>
      );
    });
  };

  return (
    <select value={value} onChange={onChange} className={className}>
      {renderOptions()}
    </select>
  );
};

Select.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

Select.defaultProps = {
  onChange: () => {},
  options: [],
  value: '',
  placeholder: undefined,
  className: undefined,
};

export default Select;
