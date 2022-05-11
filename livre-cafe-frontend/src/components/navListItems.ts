import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import Person from '@mui/icons-material/Person';
import Forum from '@mui/icons-material/Forum';
import Analytics from '@mui/icons-material/Analytics';
import FolderOpen from '@mui/icons-material/FolderOpen';
import BorderColor from '@mui/icons-material/BorderColor';
import Search from '@mui/icons-material/Search';

const navbarList = [
  {
    icon: Search,
    desc: 'Search',
    secondDesc: '',
    badge: 0,
    subList: [],
    to: '/',
  },
  {
    icon: DashboardOutlined,
    desc: 'Dashboard',
    secondDesc: '',
    badge: 0,
    subList: [],
    to: '/',
  },
  {
    icon: Person,
    desc: 'User',
    secondDesc: '',
    badge: 0,
    subList: [],
    to: '/',
  },
  {
    icon: Forum,
    desc: 'Forum',
    secondDesc: 'Message from andi',
    badge: 2,
    subList: [
      {
        desc: 'chat',
        badge: 2,
      },
      {
        desc: 'reminder',
        badge: 0,
      },
    ],
    to: '/',
  },
  {
    icon: Analytics,
    desc: 'Analytics',
    secondDesc: '',
    badge: 0,
    subList: [],
    to: '/',
  },
  {
    icon: FolderOpen,
    desc: 'Folder',
    secondDesc: '',
    badge: 0,
    subList: [],
    to: '/',
  },
  {
    icon: BorderColor,
    desc: 'Edit',
    secondDesc: '',
    badge: 0,
    subList: [],
    to: '/',
  },
];

export default navbarList;
