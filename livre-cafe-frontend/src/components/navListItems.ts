import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import Person from '@mui/icons-material/Person';
import Forum from '@mui/icons-material/Forum';
import Analytics from '@mui/icons-material/Analytics';
import FolderOpen from '@mui/icons-material/FolderOpen';
import BorderColor from '@mui/icons-material/BorderColor';
import Search from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
import PaidIcon from '@mui/icons-material/Paid';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import {
  CART_CHECKOUT_PATH,
  CUSTOMERS_PATH,
  INVENTORY_PATH,
} from '@app/constants';

const navbarList = [
  // {
  //   icon: Search,
  //   desc: 'Search',
  //   secondDesc: '',
  //   badge: 0,
  //   subList: [],
  //   to: '/',
  // },
  {
    icon: InventoryIcon,
    desc: 'Inventory',
    secondDesc: '',
    badge: 0,
    subList: [],
    to: INVENTORY_PATH,
  },
  {
    icon: Person,
    desc: 'Customers Details',
    secondDesc: '',
    badge: 0,
    subList: [],
    to: CUSTOMERS_PATH,
  },
  {
    icon: PriceCheckIcon,
    desc: 'Cart Checkout',
    secondDesc: '',
    badge: 0,
    subList: [],
    to: CART_CHECKOUT_PATH,
  },
  // {
  //   icon: Analytics,
  //   desc: 'Analytics',
  //   secondDesc: '',
  //   badge: 0,
  //   subList: [],
  //   to: '/',
  // },
  // {
  //   icon: FolderOpen,
  //   desc: 'Folder',
  //   secondDesc: '',
  //   badge: 0,
  //   subList: [],
  //   to: '/',
  // },
  // {
  //   icon: BorderColor,
  //   desc: 'Edit',
  //   secondDesc: '',
  //   badge: 0,
  //   subList: [],
  //   to: '/',
  // },
];

export default navbarList;
