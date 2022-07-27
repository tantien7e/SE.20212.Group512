import {
  selectUser,
  signOut,
} from '@app/app/features/authentication/authentication-slice';
import navList from '@app/components/navListItems';
import { LOGIN_PATH } from '@app/constants';
import { Store } from '@app/context/Store';
import { StaffResponse } from '@app/models/user.interface';
import MenuIcon from '@mui/icons-material/Menu';
import StorefrontIcon from '@mui/icons-material/Storefront';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Drawer,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useContext, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 240;
const drawerWidthOpen = 240;
const paddingIconButton = 10;
const marginIconButton = 14;
const iconFontSize = 20;
const drawerWidthClose =
  (paddingIconButton + marginIconButton) * 2 + iconFontSize;

const openedMixin = (theme: Theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

// const DrawerHeader = styled('div')(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'flex-end',
//   padding: theme.spacing(0, 1),
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
// }));

// const Drawer = styled(MuiDrawer, {
//   shouldForwardProp: (prop) => prop !== 'open',
// })(({ theme, open }) => ({
//   width: drawerWidth,
//   flexShrink: 0,
//   whiteSpace: 'nowrap',
//   boxSizing: 'border-box',
//   ...(open && {
//     ...openedMixin(theme),
//     '& .MuiDrawer-paper': openedMixin(theme),
//   }),
//   ...(!open && {
//     ...closedMixin(theme),
//     '& .MuiDrawer-paper': closedMixin(theme),
//   }),
// }));

function SideNav() {
  const matchsMD = useMediaQuery('(max-width: 768px)');
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(true);
  const refFocus = useRef<any>(null);
  const user = localStorage.getItem('user')
    ? (JSON.parse(localStorage.getItem('user') || '') as StaffResponse)
    : ({} as StaffResponse);
  const handleDrawerClose = () => {
    setOpen(!open);
  };

  const { state } = useContext(Store);
  const location = useLocation();
  const handleChangePath = (target: string) => {
    navigate(target, { replace: true });
  };
  const dispatch = useDispatch();

  const handleSignOut = () => {
    localStorage.clear();
    navigate(LOGIN_PATH);
    dispatch(signOut());
  };

  const drawerContent = (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '42px',
          width: 'auto',
          backgroundColor: 'transparent',
          margin: '14px 14px',
          padding: '12px 0px',
          borderBottom: '1px solid lightgray',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            display: open ? 'none' : { xs: 'none', sm: 'initial' },
          }}
        >
          <StorefrontIcon
            sx={{ fontSize: '20px', color: theme.palette.primary.main }}
          />
        </Box>
        <Typography
          variant="h1"
          noWrap={true}
          sx={{
            display: { xs: 'none', sm: 'initial' },
            fontSize: '20px',
            fontWeight: 600,
            color: theme.palette.primary.main,
            width: '154px',
            marginLeft: open ? '0px' : '8px',
            marginBottom: '4px',
          }}
        >
          Lirve Café
        </Typography>

        <Button
          onClick={handleDrawerClose}
          sx={{
            minWidth: 'initial',
            padding: '10px',
            color: 'gray',
            borderRadius: '8px',
            backgroundColor: open ? 'transparent' : 'transparent',
            '&:hover': {
              backgroundColor: theme.palette.secondary.light,
            },
          }}
        >
          <MenuIcon
            sx={{
              fontSize: '20px',
              color: open
                ? theme.palette.primary.main
                : theme.palette.primary.main,
            }}
          ></MenuIcon>
        </Button>
      </Box>

      <List dense={true} sx={{ flex: 1 }}>
        {navList.map((key, index) => {
          const isActive = location?.pathname === key?.to;
          const { cart } = state;
          let totalQuantity = key.badge
            ? cart?.cartItems?.reduce(
                (a, c) => Number(a) + Number(c.quantity),
                0,
              )
            : 0;
          if (state.reservation && key.badge) totalQuantity += 1;
          if (key.isOnlyManager && !user?.isManager) return;
          return (
            <div key={`list-item-${index}`}>
              <Tooltip
                title={open ? key.desc : ''}
                key={index}
                placement={'right'}
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: 'gray',
                      color: 'white',
                      marginLeft: '22px !important',
                      boxShadow: '0px 0px 22px -2px rgba(0,0,0,0.20)',
                    },
                  },
                }}
              >
                <ListItemButton
                  sx={{
                    margin: '6px 14px',
                    padding: '10px',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: theme.palette.secondary.light,
                    },
                  }}
                  onClick={() => {
                    if (!key.to) return;
                    handleChangePath(key.to);
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '46px' }}>
                    <Badge
                      badgeContent={totalQuantity}
                      color="primary"
                      variant="dot"
                    >
                      <key.icon
                        sx={{
                          fontSize: '20px',
                          color: isActive
                            ? theme.palette.primary.main
                            : theme.status.inActive,
                        }}
                      />
                    </Badge>
                  </ListItemIcon>

                  <ListItemText
                    primary={key.desc}
                    primaryTypographyProps={{
                      variant: 'body2',
                    }}
                    sx={{
                      display: 'inline',
                      margin: '0px',
                      overflowX: 'hidden',
                      color: isActive
                        ? theme.palette.primary.main
                        : theme.status.inActive,
                      '& span': { fontWeight: isActive ? 600 : 400 },
                      whiteSpace: 'nowrap',
                      minWidth: '126px',
                    }}
                  />
                  {totalQuantity !== 0 && (
                    <Chip
                      label={totalQuantity}
                      color={'primary'}
                      size="small"
                      sx={{ height: 'auto' }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </div>
          );
        })}
      </List>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          alignContents: 'center',
          margin: '14px 14px',
          padding: '12px 4px',
          borderTop: '1px solid lightgray',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            marginRight: '18px',
            paddingLeft: '0px',
            alignItems: 'center',
            alignContent: 'center',
          }}
        >
          <Typography
            sx={{ fontFamily: 'Caveat, cursive', fontWeight: 600 }}
            // color="primary"
            variant="h4"
          >
            <Avatar src={user.imageUrl} />
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Typography
            component="span"
            variant="body2"
            sx={{
              fontFamily: 'inherit',
              display: 'block',
              whiteSpace: 'nowrap',
              lineHeight: 'inherit',
              fontWeight: 500,
              // color: theme.status.inActive,
            }}
            // color="primary"
          >
            {user?.isManager ? 'Manager' : 'Staff'}
          </Typography>
          <Typography
            component="span"
            variant="body2"
            sx={{
              display: 'block',
              whiteSpace: 'nowrap',
              lineHeight: 'inherit',
              // color: theme.status.inActive,
            }}
            // color="primary"
          >
            {user?.username || ''}
          </Typography>
          <Link
            variant="button"
            onClick={handleSignOut}
            sx={{ textTransform: 'none', cursor: 'pointer' }}
          >
            <Typography
              component="span"
              variant="body2"
              sx={{
                display: 'block',
                whiteSpace: 'nowrap',
                lineHeight: 'inherit',
                // color: theme.status.inActive,
              }}
              // color="primary"
            >
              Sign out
            </Typography>
          </Link>
        </Box>
      </Box>
    </>
  );

  return (
    <div className="sidebar-container">
      <Drawer
        variant="permanent"
        anchor="left"
        open={open}
        hideBackdrop
        sx={{
          width: open
            ? { xs: '0px', sm: drawerWidthClose }
            : { xs: drawerWidthClose, sm: drawerWidthOpen },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: open
              ? theme.transitions.duration.leavingScreen
              : theme.transitions.duration.enteringScreen,
          }),
          '& .MuiDrawer-paper': {
            justifyContent: 'space-between',
            overflowX: 'hidden',
            width: open
              ? { xs: '0px', sm: drawerWidthClose }
              : { xs: drawerWidthClose, sm: drawerWidthOpen },
            borderRight: '0px',
            borderRadius: '0px 8px 8px 0px',
            boxShadow: theme.shadows[8],
            backgroundColor: open
              ? theme.palette.secondary.main
              : theme.palette.secondary.main,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: open
                ? theme.transitions.duration.leavingScreen
                : theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </div>
  );
}

export default SideNav;
