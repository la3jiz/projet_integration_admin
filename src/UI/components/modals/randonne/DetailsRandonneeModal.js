import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { MenuItem, Typography, Box, Icon } from '@mui/material';
import Card from '@mui/material/Card';
import Iconify from '../../../../components/iconify';

const DetailsRandonneeModal = ({data}) => {
    const {dateDebut,dateFin, dateRandonnee, description,destination,guide,image,nbPlace,prixRandonnee,titreRandonnee}=data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <MenuItem sx={{ color: 'primary.main' }} onClick={showModal}>
        <Iconify icon={'gg:details-more'} sx={{ mr: 2 }} />
        Details
      </MenuItem>
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <Card id="">
          <Box pt={3} px={2}>
            <Typography variant="h5" fontWeight="medium">
              Informations Randonnee:
            </Typography>
          </Box>
          <Box pt={1} pb={2} px={2}>
            <Box component="ul" display="flex" flexDirection="column" p={0} m={0}>
              <Box
                component="li"
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                bgColor="grey-100"
                borderRadius="lg"
                p={3}
                mt={2}
              >
                <Box width="100%" display="flex" flexDirection="column">
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    mb={2}
                  >
                    <Typography fontSize={18} fontWeight="medium" textTransform="capitalize">
                    {titreRandonnee}
                    </Typography>
                  </Box>
                  <Box
                    component="img"
                    sx={{
                      borderRadius:2,
                      marginBottom: 2,
                      height: 280,
                      width: 450,
                      maxHeight: { xs: 230,lg:250 , md: 230 },
                      maxWidth: { xs: 300,lg:390, md: 350 },
                    }}
                    alt="randonnee image."
                    src={image}
                  />

                  <Box mb={1} lineHeight={0}>
                    <Typography fontSize={15} fontWeight="medium"  variant="caption" color="text">
                      Prix :&nbsp;&nbsp;&nbsp;
                      <Typography fontSize={15} variant="caption" fontWeight="small" textTransform="capitalize">
                        {prixRandonnee}
                      </Typography>
                    </Typography>
                  </Box>

                  <Box mb={1} lineHeight={0}>
                    <Typography fontSize={15} fontWeight="medium"  variant="caption" color="text">
                      Description:&nbsp;&nbsp;&nbsp;
                      <Typography fontSize={15} variant="caption" fontWeight="small" >
                        {description}
                      </Typography>
                    </Typography>
                  </Box>

                  <Box mb={1} lineHeight={0}>
                    <Typography fontSize={15} fontWeight="medium" variant="caption" color="text">
                      Destination:&nbsp;&nbsp;&nbsp;
                      <Typography fontSize={15} variant="caption" fontWeight="small">
                        {destination}
                      </Typography>
                    </Typography>
                  </Box>

                  <Box mb={1} lineHeight={0}>
                    <Typography fontSize={15} fontWeight="medium"  variant="caption" color="text">
                      Date Randonnee:&nbsp;&nbsp;&nbsp;
                      <Typography fontSize={15} variant="caption" fontWeight="small">
                        {new Date(dateRandonnee).toLocaleDateString()}
                      </Typography>
                    </Typography>
                  </Box>

                  <Box mb={1} lineHeight={0}>
                    <Typography fontSize={15} fontWeight="medium"  variant="caption" color="text">
                      Date debut:&nbsp;&nbsp;&nbsp;
                      <Typography fontSize={15} variant="caption" fontWeight="small">
                        { new Date(dateDebut).toLocaleTimeString()}
                      </Typography>
                    </Typography>
                  </Box>

                  <Box mb={1} lineHeight={0}>
                    <Typography fontSize={15} fontWeight="medium"  variant="caption" color="text">
                      Date Fin:&nbsp;&nbsp;&nbsp;
                      <Typography fontSize={15} variant="caption" fontWeight="small">
                        {new Date(dateFin).toLocaleTimeString()}
                      </Typography>
                    </Typography>
                  </Box>

                  <Box mb={1} lineHeight={0}>
                    <Typography fontSize={15} fontWeight="medium"  variant="caption" color="text">
                      Nombre de place :&nbsp;&nbsp;&nbsp;
                      <Typography fontSize={15} variant="caption" fontWeight="small">
                        {nbPlace}
                      </Typography>
                    </Typography>
                  </Box>

                  <Box mb={1} lineHeight={0}>
                    <Typography fontSize={15} fontWeight="medium" variant="caption" color="text">
                      Guide :&nbsp;&nbsp;&nbsp;
                     
             
                       <Typography fontSize={15} variant="caption" fontWeight="small">
                        {guide.nomGuide}
                      </Typography>  
                    </Typography>
                  </Box>

                </Box>
              </Box>
            </Box>
          </Box>
        </Card>
      </Modal>
    </>
  );
};
export default DetailsRandonneeModal;
