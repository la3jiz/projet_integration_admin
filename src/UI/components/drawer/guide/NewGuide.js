import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Row, Select, Space } from 'antd';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import axios from 'axios';

import ImagePicker from '../../image_pickers/ImagePicker';
import { useHttpHook } from '../../../../hooks/use-http';
import Loader from '../../loaders/Loader';

const NewGuide = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const { isLoading, error, sendRequest, clearError, setError } = useHttpHook();
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState(undefined);
  const [imageFile, setImageFile] = useState(undefined);
  const [fileState, setFileState] = useState({
    selectedFile: null,
    selectedFileList: [],
  });

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    resetInputValues()
  };

  const onFileInputChange = (info) => {
    const nextState = {};
    switch (info.file.status) {
      case 'uploading':
        nextState.selectedFileList = [info.file];
        break;
      case 'done':
        nextState.selectedFile = info.file;
        nextState.selectedFileList = [info.file];
        break;
      default:
        // error or removed
        nextState.selectedFile = null;
        nextState.selectedFileList = [];
        setImagePreview(undefined);
        break;
    }
    setFileState(nextState);
  };

  const customFileInputRequest =async ({ file, onSuccess }) => {
    // * return a large string (blob data) that makes server issus when the size of image is big and its not vulnerable to logout and reloads
    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onloadend = () => {
    //   setImagePreview(reader.result);
    //
    // };

        // * return a short String url but it's vulnerable to logout and reloads
     setImagePreview(URL.createObjectURL(file));
     setImageFile(file)
    setTimeout(() => {
      onSuccess('ok');
    }, 1000);
  };

  const resetInputValues = () => {
    form.resetFields();
    setImagePreview(undefined);
    setFileState({
      selectedFile: null,
      selectedFileList: [],
    });
  };

  const onFinish = async (values) => {
    try {
    
      const formData =new FormData()
      formData.append('file',imageFile)
      formData.append('upload_preset',"project_integration_images")
       const responseCloudinery=await sendRequest("https://api.cloudinary.com/v1_1/dhsruavkb/image/upload",'POST',formData)

        const response = await sendRequest('http://localhost:8880/randonnes/guide', 'POST', {
          nomGuide: values.name,
          emailGuide: values.email,
          telephoneGuide: values.tel,
          salaire: values.salaire,
          image: responseCloudinery.data.url,
        });
        if (response.status === 200 || response.status === 201) {
         
          await refetch();
          onClose();
          resetInputValues();
        } else {
          throw new Error('some error occurred,please try later');
        }
      
    } catch (err) {
      console.log(err);
      setError(err);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <>
      {isLoading && <Loader />}
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        Nouveau Guide
      </Button>
      
      <Drawer
        title="Creer un nouveau compte"
        width={500}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
          zIndex: 1000,
        }}
      >
        <Form layout="vertical" form={form} hideRequiredMark onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Row gutter={6}>
            <Col span={12}>
              <Stack direction="row" spacing={2}>
                <Avatar alt="Remy Sharp" sx={{ width: 75, height: 75 }} src={imagePreview} />
              </Stack>
              <Form.Item
                name="image"
                label="Image"
                rules={[
                  {
                    required: true,
                    message: 'entrer une image',
                  },
                ]}
              >
                <ImagePicker state={fileState} onChange={onFileInputChange} customRequest={customFileInputRequest} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={6}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Nom"
                rules={[
                  {
                    required: true,
                    message: 'entrer nom',
                  },
                ]}
              >
                <Input placeholder="JoeDoe" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: 'email',
                    message: 'Entrer un email valide !',
                  },
                ]}
              >
                <Input placeholder="Test@test.com" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tel"
                label="Tel"
                rules={[
                  {
                    min: 8,
                    max: 8,
                    required: true,
                    message: 'entrer un  numero de 8 chiffre ',
                  },
                ]}
              >
                <Input type="number" placeholder="+216 ********" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="salaire"
                label="Salaire"
                rules={[
                  {
                    required: true,
                    message: 'entrer Salaire',
                  },
                ]}
              >
                <Input type="number" placeholder="12000" />
              </Form.Item>
            </Col>
          </Row>
          <Space style={{ marginTop: 10, display: 'flex', justifyContent: 'end' }}>
            <Button onClick={onClose}>Annuler</Button>
            <Button type="primary" htmlType="submit">
              Ajouter
            </Button>
          </Space>
        </Form>
      </Drawer>
    </>
  );
};
export default NewGuide;
