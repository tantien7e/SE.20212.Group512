import BasicOrderTable from '@app/components/BasicOrderTable';
import { CustomerDetailsBlock } from '@app/components/NormalCheckoutModal';
import {
  CustomerInterface,
  OrderInterface,
  ProductInterface,
  ProductType,
  VoucherInterface,
} from '@app/models';
import { getBackgroundColor, getSalutation } from '@app/utils';
import CloseIcon from '@mui/icons-material/Close';
import { BoxProps, TableCell, Tooltip } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import moment from 'moment';
import * as React from 'react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

export const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      <Typography variant="h5" fontWeight={600}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

interface ViewOrderModalProps {
  open: boolean;
  handleClose: () => void;
  currentOrder: OrderInterface;
}

export default function ViewOrderModal(props: ViewOrderModalProps) {
  const { open, handleClose, currentOrder } = props;
  const customer = currentOrder.customer as CustomerInterface;
  const isGuest = !currentOrder.customer;
  const theme = useTheme();
  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          View Order #{currentOrder.id || currentOrder._id}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography variant="h6">Order Details</Typography>
          <BasicOrderTable
            headCells={[
              <TableCell align="left">Name</TableCell>,
              <TableCell align="right">Quantity</TableCell>,
              <TableCell align="right">Price&nbsp;($)</TableCell>,
              <TableCell align="right">Total&nbsp;($)</TableCell>,
              <TableCell align="right">Additonal Requirements&nbsp;</TableCell>,
            ]}
            rows={
              currentOrder.reservation
                ? [
                    {
                      product: {
                        _id: currentOrder.reservation._id,
                        name: currentOrder.reservation.area.name,
                        price: currentOrder.reservation.area.costPerHour,
                      } as ProductInterface,
                      additionalRequirements:
                        currentOrder.reservation.additionalRequirements || '',
                      productType: ProductType.RESERVATION,
                      quantity: currentOrder.reservation.duration,
                    },
                    ...currentOrder.itemsOrdered,
                  ]
                : [...currentOrder.itemsOrdered]
            }
          />
          {currentOrder.vouchers && currentOrder.vouchers.length > 0 && (
            <VoucherDetailsBlock vouchers={currentOrder.vouchers} />
          )}
          {currentOrder.customer && (
            <CustomerDetailsBlock
              selectedCustomer={currentOrder.customer}
              p={0}
            />
          )}
        </DialogContent>
        <Box p={2} py={2}>
          <Typography variant="body2">
            Ordered at{' '}
            {moment(currentOrder.bookedAt).format('DD MMM YYYY, hh:mm A')} by{' '}
            <strong>
              {isGuest
                ? 'Guest'
                : `${getSalutation(customer.gender)} ${customer.firstName} ${
                    customer.lastName || ''
                  }`}
            </strong>
            .
          </Typography>
        </Box>
      </BootstrapDialog>
    </div>
  );
}

interface VoucherDetailsBlockProps extends BoxProps {
  vouchers: VoucherInterface[];
}

export function VoucherDetailsBlock(props: VoucherDetailsBlockProps) {
  const { vouchers, ...boxProps } = props;
  return (
    <Box my={2}>
      <Typography variant="h6" mb={2}>
        Vouchers
      </Typography>
      {vouchers.map((voucher) => (
        <VoucherBadge voucher={voucher} />
      ))}
    </Box>
  );
}

interface VoucherBadgeProps extends BoxProps {
  voucher: VoucherInterface;
}

export function VoucherBadge(props: VoucherBadgeProps) {
  const { voucher, ...boxProps } = props;
  return (
    <Tooltip title={voucher.name}>
      <Box
        sx={{
          width: 120,
          backgroundColor: getBackgroundColor(voucher.color),
          borderRadius: 3,
          p: 1,
        }}
      >
        <Typography
          fontWeight={600}
          color={voucher.color}
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          overflow="hidden"
        >
          {voucher.name}
        </Typography>
      </Box>
    </Tooltip>
  );
}
