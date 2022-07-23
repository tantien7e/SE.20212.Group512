import {
  selectVouchersUpdateLoading,
  updateVoucher,
} from '@app/app/features/vouchers/vouchers-slice';
import { RankType } from '@app/models';
import {
  VoucherInterface
} from '@app/models/voucher.interface';
import { round0 } from '@app/utils';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Container,
  Divider,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';
import NumberFormat from 'react-number-format';
import { CountryData } from 'react-phone-input-2';
import { useDispatch, useSelector } from 'react-redux';

const style = {
  // position: 'absolute' as 'absolute',
  // top: '50%',
  // left: '50%',
  // transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '768px',
  bgcolor: 'background.paper',
  border: '0.5px solid #000',
  borderRadius: '8px',
  boxShadow: 24,
  //   minHeight: 'calc(100vh - 64px)',
  height: 'auto',
  margin: '32px auto',
  p: 4,
};

const Input = styled('input')({
  display: 'none',
});

interface AddModalProps {
  open: boolean;
  handleClose: () => void;
  item?: VoucherInterface;
}

interface VoucherStateInterface {
  _id: string;
  name: string;
  correspondingRank: string,
  available: boolean,
  pointsCost: number,
  percentageDiscount: number,
  maxAmount: number,
}

export interface ErrorStateInterface {
  name: boolean;
  correspondingRank: boolean,
  pointsCost: boolean,
  percentageDiscount: boolean,
  maxAmount: boolean,
}

export default function EditVoucherModal(props: AddModalProps) {
  const dispatch = useDispatch();
  const vouchersLoading = useSelector(selectVouchersUpdateLoading);
  const [addSuccess, setAddSuccess] = useState(false);
  const { open, handleClose, item } = props;

  const [voucherState, setVoucherState] = useState<VoucherStateInterface>({
    _id: item?._id || '',
    name: item?.name || '',
    correspondingRank: item?.correspondingRank || '',
    available: item?.available || false,
    pointsCost: item?.pointsCost || 0,
    percentageDiscount: item?.percentageDiscount || 0,
    maxAmount: item?.maxAmount || 0,
  });

  const [errorState, setErrorState] = useState<ErrorStateInterface>({
    name: false,
    correspondingRank: false,
    pointsCost: false,
    percentageDiscount: false,
    maxAmount: false,
  });
  const theme = useTheme();
  const headerPadding = `${theme.spacing(2)} 0`;


  const handleChangeText = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      | SelectChangeEvent,
    field: keyof VoucherInterface,
  ) => {

    const isNumberField =
      field === 'pointsCost' || 'maxAmount' || 'percentageDiscount';
    setVoucherState((prevState) => {
      let value;
      if (field == "available") {
        value = (e.target.value == "Available")
      }
      else {
        value = e.target.value
      }

      return { ...prevState, [field]: value };
    });
    setErrorState((prevState) => {
      return {
        ...prevState,
        [field]: !isNumberField ? !e.target.value : !Number(e.target.value),
      };
    });
  };

  const generatePostData = (body: VoucherInterface) => {
    const {
      _id,
      name,
      correspondingRank,
      available,
      pointsCost,
      percentageDiscount,
      maxAmount,
    } = body;

    return {
      _id,
      name,
      correspondingRank,
      available,
      pointsCost,
      percentageDiscount,
      maxAmount,
    };
  };

  const handleSave = () => {
    const error = {
      name: !voucherState.name,
      correspondingRank: !voucherState.correspondingRank,
      pointsCost: voucherState.pointsCost <= 0,
      percentageDiscount: voucherState.percentageDiscount <= 0,
      maxAmount: voucherState.maxAmount <= 0,
    };
    setErrorState(error);
    const passable = !(Object.values(error).findIndex((item) => item) > -1);
    if (!passable) return;
    const voucherData = generatePostData(voucherState);
    console.log(voucherData)
    dispatch(updateVoucher(voucherData as VoucherInterface));
    setAddSuccess(true);
  };

  React.useEffect(() => {
    const loading = vouchersLoading;
    if (addSuccess && !loading) {
      handleClose();
    }
  }, [addSuccess, vouchersLoading]);

  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
          handleClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            color={theme.palette.secondary.contrastText}
            style={{ padding: ` ${theme.spacing(1)} 0` }}
          >
            <strong> Edit This Voucher</strong>
          </Typography>
          <Divider />

          <Container sx={{ padding: headerPadding }} maxWidth="lg">
            <Grid container spacing={2}>
              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="voucher-name">Voucher Name</label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <TextField
                    variant="outlined"
                    id="voucher-name"
                    aria-describedby="my-helper-text"
                    fullWidth
                    value={voucherState?.name}
                    onChange={(e) => handleChangeText(e, 'name')}
                    error={errorState.name}
                  />
                </Grid>
              </Grid>

              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="corresponding-rank">Corresponding Rank</label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <Select
                    variant="outlined"
                    id="corresponding-rank"
                    aria-describedby="my-helper-text"
                    fullWidth
                    value={voucherState.correspondingRank}
                    onChange={(e) =>
                      handleChangeText(e, 'correspondingRank')
                    }
                    error={errorState.correspondingRank}
                  >
                    <MenuItem value={RankType.SILVER}>Silver</MenuItem>
                    <MenuItem value={RankType.GOLD}>Gold</MenuItem>
                    <MenuItem value={RankType.PLATINUM}>Platinum</MenuItem>
                    <MenuItem value={RankType.DIAMOND}>Diamond</MenuItem>
                  </Select>
                </Grid>
              </Grid>

              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="voucher-point-loss">Point Loss</label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <TextField
                    variant="outlined"
                    id="voucher-point-loss"
                    aria-describedby="my-helper-text"
                    fullWidth
                    value={round0(voucherState?.pointsCost)}
                    InputProps={{
                      inputComponent: NumberFormatCustom as any,
                    }}
                    onChange={(e) => handleChangeText(e, 'pointsCost')}
                    error={errorState.pointsCost}
                    helperText={
                      errorState.pointsCost &&
                      'Point loss must be more than 0'
                    }
                  />
                </Grid>
              </Grid>

              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="voucher-availability">Availability</label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={voucherState.available ? "Available" : "Non - Available"}
                    onChange={(e) => handleChangeText(e, 'available')}
                  >
                    <MenuItem value={"Available"}>Available</MenuItem>
                    <MenuItem value={"Non - Available"}>Non - Available</MenuItem>
                  </Select>
                </Grid>
              </Grid>

              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="voucher-amount">Max Discount Amount</label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <TextField
                    variant="outlined"
                    id="voucher-amount"
                    aria-describedby="my-helper-text"
                    fullWidth
                    value={voucherState?.maxAmount}
                    onChange={(e) => handleChangeText(e, 'maxAmount')}
                    InputProps={{
                      inputMode: 'numeric',
                      inputComponent: NumberFormatCustom as any,
                    }}
                    error={errorState.maxAmount}
                    helperText={
                      errorState.maxAmount &&
                      'Discount amount must not be less than or equal to 0'
                    }
                  />
                </Grid>
              </Grid>

              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="voucher-perentage-discount">
                    Discount Percentage
                  </label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <TextField
                    variant="outlined"
                    id="voucher-percentage-discount"
                    aria-describedby="my-helper-text"
                    fullWidth
                    value={voucherState?.percentageDiscount}
                    onChange={(e) => handleChangeText(e, 'percentageDiscount')}
                    InputProps={{
                      inputMode: 'numeric',
                      inputComponent: NumberFormatCustom as any,
                    }}
                    error={errorState.percentageDiscount}
                    helperText={
                      errorState.percentageDiscount &&
                      'Discount amount must not be less than or equal to 0'
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Container>

          <Divider />
          <Grid
            container
            justifyContent="space-between"
            padding={`${theme.spacing(2)} 0`}
          >
            <Grid>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
            </Grid>
            <Grid>
              <LoadingButton
                variant="contained"
                loading={vouchersLoading}
                loadingPosition="end"
                onClick={() => handleSave()}
                endIcon={<SaveIcon />}
              >
                Save{' '}
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div >
  );
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumberFormatCustom = React.forwardRef<NumberFormat<string>, CustomProps>(
  function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
      />
    );
  },
);
