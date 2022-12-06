// @mui
import PropTypes from 'prop-types';
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader, MenuItem } from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// ----------------------------------------------------------------------

AppNewsUpdate.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppNewsUpdate({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {list.map((news) => (
            <NewsItem key={news.id} news={news} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button size="small" color="inherit" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
          View all
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

NewsItem.propTypes = {
  news: PropTypes.shape({
    description: PropTypes.string,
    image: PropTypes.string,
    postedAt: PropTypes.instanceOf(Date),
    title: PropTypes.string,
  }),
};

function NewsItem({ news }) {
  const { image, title, description, postedAt } = news;

  return (
    
    <Stack direction="row" alignItems="center" spacing={2}>

      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Typography color="inherit" variant="subtitle2" underline="hover" noWrap>
          {title}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {description}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {description}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {description}
        </Typography>
      </Box>
      <Stack direction="row" alignItems="center" spacing={2}>
        <MenuItem >
          <Iconify sx={{ color: 'success.main' , mr: 2 }} icon={'mdi:success'}  />
          Accepter
        </MenuItem>
        <MenuItem sx={{ color: 'error.main'}}>
          <Iconify icon={'gridicons:cross'} sx={{ color: 'error.main' ,mr: 2 }} />
          Refuser
        </MenuItem>
      </Stack>
    </Stack>
  );
}
