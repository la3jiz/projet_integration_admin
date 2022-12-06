import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import {MenuItem} from '@mui/material'
import Iconify from '../../../../components/iconify/Iconify';

const DeleteAlertDialog=({deleteFn})=> {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
const onDelete=()=>{
  deleteFn()
  handleClose()
}

  return (
    <div>
       <MenuItem sx={{ color: 'error.main' }} onClick={handleClickOpen}>
                            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                            Supprimer
                          </MenuItem>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"êtes-vous sûr ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          cet élément sera supprimé et ne pourra pas être restauré.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button  onClick={handleClose}>Annuler</Button>
          <Button color='error' onClick={onDelete} autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default DeleteAlertDialog;