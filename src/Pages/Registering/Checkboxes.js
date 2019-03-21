import React from "react";

const Radio = props => {
  return (
    <div className="col-sm-4">
      <div className="form-check">
        <label>
          <input
            type="radio"
            name={props.name}
            value={props.value}
            checked={props.checked}
            className="form-check-input"
            onChange={props.onChange}
          />
          {props.label}
        </label>
      </div>
    </div>
  );
};

export default Radio;
