import React, {useRef, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'

function EditProfileTextField(props) {
    const {id, className, dataName, data, setData, labelText, type="text", errors = []} = props
    const inputRef = useRef(null);
    return (
        <div className={className}>
            <label htmlFor={id} className="form-label">{labelText}</label>
            <input
                id={id}
                type={type}
                className="form-control"
                style={
                    errors.length > 0 ? {borderColor: "red"} : {borderColor: "#ced4da"}
                }
                value={data[dataName]}
                ref={inputRef}
                onChange={(e) => {
                    setData({
                        ...data,
                        [dataName]: e.target.value
                    })
                }}
            />
            {
                errors.map((error) => (
                    <p key={error} style={{color: "red"}}>{error}</p>
                ))
            }
        </div>
    )
}

export default EditProfileTextField