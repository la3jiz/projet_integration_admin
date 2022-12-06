// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Guide',
    path: '/guide',
    icon: icon('ic_user'),
  },
  {
    title: 'Randonnee',
    path: '/randonnee',
    icon:  <SvgColor src={`/assets/icons/navbar/country.png`} sx={{ width: 1, height: 1 }} />,
  },
  {
    title: 'Participation',
    path: '/reservation',
    icon:  <SvgColor src={`/assets/icons/navbar/reserve.png`} sx={{ width: 1, height: 1 }} />,
  },
];

export default navConfig;
