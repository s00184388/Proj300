import React from 'react';

const InputField=(props)=>{
    return(
        <div className='form-group input-group-sm col-sm-6'>
            <input
                className="form-control"
                name={props.name}
                type={props.type}
                placeholder={props.placeholder}
                onChange={props.onChange}
                value={props.value}
                />
        </div>
    )
}

export default InputField;