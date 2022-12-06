import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  TreeSelect,
  Upload,
  Col,
  Drawer,
  Row,
  Space,
  TimePicker,
  Spin
} from 'antd';
import { MenuItem, Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import Iconify from '../../../../components/iconify';
import { useHttpHook } from '../../../../hooks/use-http';

const { TextArea } = Input;
const UpdateRandoModal = ({ randoData, updateFn }) => {
  const { sendRequest, isLoading, setError } = useHttpHook();
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isChangeImage, setIsChangeImage] = useState(true);
  const [form] = Form.useForm();
  const {
    idRandonnee,
    dateDebut,
    dateFin,
    dateRandonnee,
    description,
    destination,
    guide,
    image,
    nbPlace,
    prixRandonnee,
    titreRandonnee,
  } = randoData;
  const [imageFile, setImageFile] = useState(undefined);
  const handleCloseUpdateModal = () => {
    setIsOpenUpdateModal(false);
    setIsChangeImage(true);
  };

  const { data, isSuccess } = useQuery(
    ['select_Guides'],
    () => sendRequest('http://localhost:8880/randonnes/guide', 'GET'),
    { staleTime: Infinity, cacheTime: Infinity }
  );
  let guidesData = [];
  if (isSuccess) {
    guidesData = [...data.data._embedded.guides];
  }

  const onFIleChange = ({ file, fileList }) => {
    setImageFile(file.originFileObj);
  };

  const onFinish = async (values) => {
    console.log(values);
    if (imageFile === undefined) {
      await updateFn(
        `http://localhost:8880/randonnes/rando`,
        idRandonnee,
        values.titre,
        values.description,
        values.destination,
        values.prixRandonnee,
        new Date(values.dateRandonnee),
        new Date(values.dateDebut),
        new Date(values.dateFin),
        values.nbPlace,
        !values.guide ? guide.idGuide : values.guide,
        image
      );
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
        `http://localhost:8880/randonnes/rando`,
        idRandonnee,
        values.titre,
        values.description,
        values.destination,
        values.prixRandonnee,
        new Date(values.dateRandonnee),
        new Date(values.dateDebut),
        new Date(values.dateFin),
        values.nbPlace,
        !values.guide ? guide.idGuide : values.guide,
        responseCloudinery.data.url
      );
      setIsOpenUpdateModal(false);
    }
    form.resetFields();
    setIsChangeImage(true);
  };

  return (
    <>
      <MenuItem onClick={() => setIsOpenUpdateModal(true)}>
        <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
        Modifier
      </MenuItem>
      <Modal
        visible={isOpenUpdateModal}
        title="Modifier Une Randonnee"
        footer={null}
        onCancel={handleCloseUpdateModal}
        //   onOk={onCreate}
      >
        <Form onFinish={onFinish} layout="vertical" hideRequiredMark>
          <Row gutter={12}>
            {isChangeImage ? (
              <Col style={{ paddingTop: 32 }}>
                <Box
                  component="img"
                  sx={{
                    borderRadius: 2,
                    height: 100,
                    width: 100,
                  }}
                  alt="randonnee image."
                  src={image}
                />
              </Col>
            ) : (
              <Col>
                <Form.Item label="Image" name="image" sx={{ width: 'auto', height: 100, m: 0, p: 0 }}>
                  <Upload onChange={onFIleChange} listType="picture-card">
                    <div>
                      <PlusOutlined />
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  </Upload>
                </Form.Item>
              </Col>
            )}
          </Row>
          <Row
            style={{
              position: !isChangeImage && 'relative',
              bottom: !isChangeImage ? 25 : 0,
              marginBottom: isChangeImage ? 24 : 0,
              marginTop: isChangeImage ? 6 : 0,
            }}
          >
            <Button onClick={() => setIsChangeImage(!isChangeImage)}>
              {isChangeImage ? 'Changer Image' : 'Annuler'}
            </Button>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                initialValue={titreRandonnee}
                style={{ width: 250 }}
                label="Titre"
                name="titre"
                rules={[{ required: true, message: 'entrer un titre' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={18}>
              <Form.Item
                initialValue={description}
                label="Description"
                name="description"
                rules={[{ required: true, message: 'entrer une description' }]}
              >
                <TextArea style={{ marginLeft: 4 }} rows={4} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                initialValue={destination}
                label="Destination"
                name="destination"
                rules={[{ required: true, message: 'entrer une destination' }]}
              >
                <Input style={{ marginLeft: 4 }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                initialValue={dayjs(new Date(dateRandonnee).toLocaleDateString())}
                label="Date Rondonnee"
                name="dateRandonnee"
                rules={[{ required: true, message: 'entrer une date de randonnee' }]}
              >
                <DatePicker style={{ marginLeft: 4 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                initialValue={dayjs(new Date(dateDebut).toLocaleTimeString(), 'HH:mm:ss')}
                label="Date Debut"
                name="dateDebut"
                rules={[{ required: true, message: 'entrer une date du debut' }]}
              >
                <TimePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                initialValue={dayjs(new Date(dateFin).toLocaleTimeString(), 'HH:mm:ss')}
                label="Date Fin"
                name="dateFin"
                rules={[{ required: true, message: 'entrer une date du fin' }]}
              >
                <TimePicker />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                initialValue={nbPlace}
                label="Nombre De Place:"
                name="nbPlace"
                rules={[{ required: true, message: 'entrer un nombre de place' }]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                initialValue={prixRandonnee}
                label="Prix :"
                name="prixRandonnee"
                rules={[{ required: true, message: 'entrer un prix ' }]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Guides" name="guide">
                <Select defaultValue={guide.nomGuide}>
                  {guidesData.map((item) => {
                    const urlSplitting = item._links.guide.href.split('/');
                    const idGuide = Number(urlSplitting[urlSplitting.length - 1]);
                    return <Select.Option value={idGuide}>{item.nomGuide}</Select.Option>;
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Space style={{ marginTop: 10, display: 'flex', justifyContent: 'end' }}>
            <Button onClick={handleCloseUpdateModal}>Annuler</Button>
            <Button type="primary" htmlType="submit">
               {isLoading ? <Spin style={{ Color: 'white', width: 50 }} /> : 'Modifer'}
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateRandoModal;
