import React, { useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  Button,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Upload,
  Col,
  Drawer,
  Row,
  Space,
  TimePicker,
} from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useHttpHook } from '../../../../hooks/use-http';
import Loader from '../../loaders/Loader';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const NewRando = ({refetchRando}) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { sendRequest, error, setError,isLoading } = useHttpHook();
  const [imageFile,setImageFile]=useState('')

  const { data, isSuccess } = useQuery(
    ['selectGuides'],
    () => sendRequest('http://localhost:8880/randonnes/guide', 'GET'),
    { staleTime: Infinity, cacheTime: Infinity }
  );
  let guidesData = [];
  if (isSuccess) {
    guidesData = [...data.data._embedded.guides];
  }

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    form.resetFields()
  };


  const onFIleChange = ({file,fileList}) => {
        setImageFile(file.originFileObj);
  };

  const onFinish=async(values)=>{
    try {
      const formData =new FormData()
      formData.append('file',imageFile)
      formData.append('upload_preset',"project_integration_images")
       const responseCloudinery=await sendRequest("https://api.cloudinary.com/v1_1/dhsruavkb/image/upload",'POST',formData)

        const response = await sendRequest('http://localhost:8880/randonnes/rando', 'POST', {
          titreRandonnee: values.titre,
          description: values.description,
          destination: values.destination,
          prixRandonnee:values.prixRandonnee,
          dateRandonnee: new Date(values.dateRandonnee),
          dateDebut:new Date(values.dateDebut),
          dateFin:new Date(values.dateFin),
          nbPlace:values.nbPlace,
          guideId:values.guide,
          image: responseCloudinery.data.url,
        });
        if (response.status === 200 || response.status === 201) {
          await refetchRando();
          onClose();
          form.resetFields()
        } else {
          throw new Error('some error occurred,please try later');
        }
    } catch (err) {
      console.log(err);
      setError(err);
    }
  
  }
  return (
    <>
    {isLoading && <Loader/>}
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        Nouveau Randonnee
      </Button>

      <Drawer
        title="Creer une nouvelle randonnee"
        width={500}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
          zIndex: 1000,
        
        }}
      >
   
         
   
        <Form onFinish={onFinish} layout="vertical" form={form} hideRequiredMark >


            <Form.Item
            label="Image"
            name="image"
            sx={{width:'auto'}}
            rules={[{ required: true, message: 'enter une image' }]}
          >
            <Upload onChange={onFIleChange}  listType="picture-card">
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


          <Row gutter={16}>
            <Col span={8}>
            <Form.Item style={{width:250}} label="Titre" name="titre" rules={[{ required: true, message: 'entrer un titre' }]}>
            <Input />
          </Form.Item>
            </Col>

            <Col span={18}>
            <Form.Item label="Description" name="description" rules={[{ required: true, message: 'entrer une description' }]}>
            <TextArea style={{marginLeft:4}} rows={4} />
          </Form.Item>
            </Col>
          </Row>

              <Row gutter={16}>
                <Col span={12}>
                <Form.Item
                label="Destination"
                name="destination"
                rules={[{ required: true, message: 'entrer une destination' }]}
              >
                <Input style={{marginLeft:4}}/>
              </Form.Item>
                </Col>

                <Col span={12}>
                      <Form.Item
                label="Date Rondonnee"
                name="dateRandonnee"
      
                rules={[{ required: true, message: 'entrer une date de randonnee' }]}
              >
                <DatePicker style={{marginLeft:4}} />
              </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
        
                <Form.Item
            label="Date Debut"
            name="dateDebut"

            rules={[{ required: true, message: 'entrer une date du debut' }]}
          >
            <TimePicker />
          </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item label="Date Fin" name="dateFin" rules={[{ required: true, message: 'entrer une date du fin' }]}>
            <TimePicker />
          </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                <Form.Item
            label="Nombre De Place:"
            name="nbPlace"
            rules={[{ required: true, message: 'entrer un nombre de place' }]}
          >
            <InputNumber />
        </Form.Item>
        </Col>
        <Col span={12}>
        <Form.Item
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
            <Form.Item label="Guides" name="guide" rules={[{ required: true, message: 'selectionner un guide' }]}>
            <Select>
              {guidesData.map(item=>{
                const urlSplitting=item._links.guide.href.split('/')
                const idGuide=Number(urlSplitting[urlSplitting.length-1])                
                return <Select.Option value={idGuide}>{item.nomGuide}</Select.Option>})}
            </Select>
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

export default NewRando;
