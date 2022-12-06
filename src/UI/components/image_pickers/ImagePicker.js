import React,{useState} from 'react';
import { Upload, Button } from 'antd';


const ImagePicker = ({state,onChange,customRequest}) => {

  return (
    <div className="App">
      <Upload fileList={state.selectedFileList} customRequest={customRequest} onChange={onChange}>
        <Button>Choose Image</Button>
      </Upload>
      {/* <br />
      <h3>Current State Log</h3>
      <pre>{JSON.stringify(state, null, 2)}</pre> */}
    </div>
  );
};

export default ImagePicker;
