import {
  CART_CHECKOUT_PATH,
  CUSTOMERS_PATH,
  INVENTORY_PATH,
  ORDERS_PATH,
  STAFFS_PATH,
  WORKSPACES_PATH,
} from '@app/constants';
import EventNoteIcon from '@mui/icons-material/EventNote';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Person from '@mui/icons-material/Person';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import WorkspacesIcon from '@mui/icons-material/Workspaces';

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
    icon: WorkspacesIcon,
    desc: 'Work Spaces',
    secondDesc: '',
    badge: 0,
    subList: [],
    to: WORKSPACES_PATH,
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
    badge: true,
    subList: [],
    to: CART_CHECKOUT_PATH,
  },
  {
    icon: EventNoteIcon,
    desc: 'Orders',
    secondDesc: '',
    to: ORDERS_PATH,
  },

  {
    icon: PeopleAltIcon,
    desc: 'Staffs',
    secondDesc: '',
    to: STAFFS_PATH,
    isOnlyManager: true,
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
