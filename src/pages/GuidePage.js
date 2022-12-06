import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
// * this package for dummy data
// import { sentenceCase } from 'change-case';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Snackbar,
  Alert,
} from '@mui/material';
// components
import Loader from '../UI/components/loaders/Loader';
import Scrollbar from '../components/scrollbar';
import { useHttpHook } from '../hooks/use-http';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import UpdateGuideModal from '../UI/components/modals/guide/UpdateGuideModal';
import NewGuide from '../UI/components/drawer/guide/NewGuide';
import AlertDialog from '../UI/components/dialogs/shared/DeleteAlertDialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nom', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'tel', label: 'Tel', alignRight: false },
  { id: 'salaire', label: 'Salaire', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: false },
];

// ----------------------------------------------------------------------

function applySortFilter(array, searched) {
  return array.filter((item) => {
    if (
      item.nomGuide.toString().toLowerCase().includes(searched.toString().toLowerCase()) ||
      item.emailGuide.toString().toLowerCase().includes(searched.toString().toLowerCase()) ||
      item.telephoneGuide.toString().includes(searched.toString().toLowerCase()) ||
      item.salaire.toString().includes(searched.toString().toLowerCase())
    ) {
      return true;
    }
    return false;
  });
}

export default function GuidePage() {
  const [page, setPage] = useState(0);

  const [selected, setSelected] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [isDeleted, setIsDeleted] = useState(false);

  const [isUpdated, setIsUpdated] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { sendRequest, error, setError } = useHttpHook();

  const { data, isLoading, isSuccess, refetch } = useQuery(
    ['guides'],
    () => sendRequest('http://localhost:8880/randonnes/guide', 'GET'),
    { staleTime: Infinity, cacheTime: Infinity }
  );
  let guidesData = [];
  if (isSuccess) {
    guidesData = [...data.data._embedded.guides];
    console.log(guidesData)
  }

  // alert colse
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsDeleted(false);
    setIsUpdated(false);
  };

  const handleDelete = async (url) => {
    try {
      const response = await sendRequest(url, 'DELETE');
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        refetch();
        setIsDeleted(true);
      } else {
        setIsDeleted(true);
        throw new Error("can't delete for now, try later");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (url, nomGuide, emailGuide, telephoneGuide, salaire, image) => {
    try {
      const response = await sendRequest(url, 'PUT', {
        nomGuide,
        emailGuide,
        telephoneGuide,
        salaire,
        image,
      });
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        setIsUpdated(true);
        refetch();
      } else {
        throw new Error("can't update for now, try later");
      }
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(guidesData, filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      {isLoading && <Loader />}
      <Helmet>
        <title> guide </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Guide
          </Typography>
          <NewGuide refetch={refetch} />
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {/* {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => { */}
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const { nomGuide, emailGuide, telephoneGuide, salaire, image } = row;

                    return (
                      <>
                        <TableRow hover>
                          <TableCell>{''}</TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={nomGuide} src={image} />

                              <Typography variant="subtitle2" noWrap>
                                {nomGuide}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{emailGuide}</TableCell>

                          <TableCell align="left">{telephoneGuide}</TableCell>

                          <TableCell align="left">{salaire}</TableCell>

                          {/* <TableCell align="left">
                          <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell> */}

                          <TableCell align="left" sx={{ display: 'flex' }}>
                            <UpdateGuideModal data={row} updateFn={handleUpdate} />
                            <AlertDialog deleteFn={() => handleDelete(row._links.guide.href)} />
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                </TableBody>

                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={guidesData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Snackbar open={isDeleted} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert severity={error !== null ? 'error' : 'success'} sx={{ width: '100%' }} onClose={handleAlertClose}>
          {error === null ? 'supprimer avec succes !' : 'erreur est survenue !'}
        </Alert>
      </Snackbar>
      <Snackbar open={isUpdated} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert severity={error !== null ? 'error' : 'success'} sx={{ width: '100%' }} onClose={handleAlertClose}>
          {error === null ? 'modifier avex succes !' : 'erreur est survenue !'}
        </Alert>
      </Snackbar>
    </>
  );
}
