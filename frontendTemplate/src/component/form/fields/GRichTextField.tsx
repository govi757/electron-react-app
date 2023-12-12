import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const GRichTextField = (props: {
    onInput: (value: any) =>void;
    fullWidth: boolean;
    className?: string;
}) =>{
    const handleOnchange = (event: any) => {
        props.onInput(event);
    }
    console.log(props,"props")
  return <ReactQuill  theme="snow" {...props} onChange={handleOnchange} className={props.className+' mb-5'}/>;
}
export default GRichTextField;