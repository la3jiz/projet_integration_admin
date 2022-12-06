import React, { useState } from 'react';
import { Modal, Col, Form, Input, Row, Button, Space, Spin } from 'antd';
import { MenuItem } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import ImagePicker from '../../image_pickers/ImagePicker';
import Iconify from '../../../../components/iconify';
import { useHttpHook } from '../../../../hooks/use-http';

const UpdateGuideModal = (props) => {
  const { sendRequest, isLoading, setError } = useHttpHook();
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const { data, updateFn } = props;
  const [form] = Form.useForm();
  const { nomGuide, emailGuide, telephoneGuide, salaire, image } = data;
  const [state, setState] = useState({
    selectedFile: null,
    selectedFileList: [],
  });
  const [imagePreview, setImagePreview] = useState(undefined);
  const [imageFile, setImageFile] = useState(undefined);

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
    setState(nextState);
  };

  const customFileInputRequest = async ({ file, onSuccess }) => {
    setImageFile(file);
    setTimeout(() => {
      onSuccess('ok');
    }, 1000);
  };

  const onFinish = async (values) => {
    if (imageFile === undefined) {
      await updateFn(data._links.guide.href, values.name, values.email, values.tel, values.salaire, image);
      setIsOpenUpdateModal(false);
    } else {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', 'project_integration_images');
      const responseCloudinery = await sendRequest(
        'https://api.cloudinary.com/v1_1/dhsruavkb/image/upload',
        'POST',
        formData
      );

      await updateFn(
        data._links.guide.href,
        values.name,
        values.email,
        values.tel,
        values.salaire,
        responseCloudinery.data.url
      );
      setIsOpenUpdateModal(false);
    }
  };

  return (
    <>
      <MenuItem onClick={() => setIsOpenUpdateModal(true)}>
        <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
        Modifier
      </MenuItem>
      <Modal
        visible={isOpenUpdateModal}
        title="Modifier Un Guide"
        footer={null}
        onCancel={() => setIsOpenUpdateModal(false)}
        //   onOk={onCreate}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={6}>
            <Col span={12}>
              <Stack direction="row" spacing={2}>
                <Avatar alt="Remy Sharp" sx={{ width: 75, height: 75 }} src={!imagePreview ? image : imagePreview} />
              </Stack>
              <Form.Item name="image" label="Image">
                <ImagePicker state={state} onChange={onFileInputChange} customRequest={customFileInputRequest} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={6}>
            <Col span={12}>
              <Form.Item
                initialValue={nomGuide}
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
                initialValue={emailGuide}
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
                initialValue={telephoneGuide}
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
                initialValue={salaire}
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
            <Button onClick={() => setIsOpenUpdateModal(false)}>Annuler</Button>
            <Button type="primary" htmlType="submit">
              {isLoading ? <Spin style={{ Color: 'white', width: 50 }} /> : 'Modifer'}
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateGuideModal;
