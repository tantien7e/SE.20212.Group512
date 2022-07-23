import {
  selectBooksUpdateLoading,
  updateBook,
} from '@app/app/features/books/books-slice';
import {
  selectDrinksUpdateLoading,
  updateDrink,
} from '@app/app/features/drinks/drinks-slice';
import { InventoryType, PREFIX_URL } from '@app/constants';
import { CartAction, CartItemInterface, Store } from '@app/context/Store';
import { VoucherInterface } from '@app/models';
import { BookInterface, DrinkInterface } from '@app/models/product.interface';
import { round0, round2 } from '@app/utils';
import { toastError, toastInformSuccess } from '@app/utils/toast';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Container,
  Divider,
  FormHelperText,
  Grid,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React, { useContext } from 'react';
import { useState } from 'react';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';

export interface ErrorStateInterface {
  voucherName?: boolean;
  correspondingRanking?: boolean;
  pointLoss?: boolean;
  percentageDiscount: boolean;
  maxAmount: boolean;
}

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
  // minHeight: 'calc(100vh - 64px)',
  height: 'auto',
  margin: '32px auto',
  p: 4,
};

const Input = styled('input')({
  display: 'none',
});

interface EditVoucherModalPropsInterface {
  open: boolean;
  handleClose: () => void;
  item: VoucherInterface;
}

export default function EditVoucherModal(
  props: EditVoucherModalPropsInterface,
) {
  const { open, handleClose, item } = props;
  // const updateDrinkLoading = useSelector(selectDrinksUpdateLoading);
  // const updateBookLoading = useSelector(selectBooksUpdateLoading);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { dispatch } = useContext(Store);
  const [voucherState, setVoucherState] = useState<VoucherInterface>({
    _id: item?._id || '',
    id: item?.id || '0',
    voucherName: item?.voucherName || '',
    correspondingRanking: item?.correspondingRanking || '',
    available: item?.available || false,
    pointLoss: item?.pointLoss || 0,
    percentageDiscount: item?.percentageDiscount || 0,
    maxAmount: item?.maxAmount || 0,
  });

  const [errorState, setErrorState] = useState<ErrorStateInterface>({
    voucherName: false,
    correspondingRanking: false,
    pointLoss: false,
    percentageDiscount: false,
    maxAmount: false,
  });

  const theme = useTheme();
  const headerPadding = `${theme.spacing(2)} 0`;

  const handleChangeText = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | SelectChangeEvent,
    field: keyof VoucherInterface,
  ) => {
    const isNumberField =
      field === 'pointLoss' || 'maxAmount' || 'percentageDiscount';
    setVoucherState((prevState) => {
      return { ...prevState, [field]: e.target.value };
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
      id,
      voucherName,
      correspondingRanking,
      available,
      pointLoss,
      percentageDiscount,
      maxAmount,
    } = body;

    return {};
  };

  const genPostItem = (voucherState: VoucherInterface): VoucherInterface => {
    const {
      id,
      voucherName,
      correspondingRanking,
      available,
      pointLoss,
      percentageDiscount,
      maxAmount,
    } = voucherState;

    const postItem = {
      id: id,
      voucherName: voucherName,
      correspondingRanking: correspondingRanking,
      available: available,
      pointLoss: pointLoss,
      percentageDiscount: percentageDiscount,
      maxAmount: maxAmount,
    };

    return postItem as VoucherInterface;
  };

  const handleSave = () => {
    const {
      id,
      voucherName,
      correspondingRanking,
      available,
      pointLoss,
      percentageDiscount,
      maxAmount,
    } = voucherState;

    const error = {
      voucherName: !voucherName,
      correspondingRanking: !correspondingRanking,
      pointLoss: pointLoss <= 0,
      percentageDiscount: percentageDiscount <= 0,
      maxAmount: maxAmount <= 0,
    };
    setErrorState(error);
    const passable = !(Object.values(error).findIndex((item) => item) > -1);

    console.log(error);
    if (!passable) return;
    const newItem = genPostItem(voucherState);
    dispatch({ type: CartAction.ADD_VOUCHERS, payload: newItem });
    toastInformSuccess('Changes saved!');
    handleClose();
  };

  // React.useEffect(() => {
  //   const updateLoading = updateDrinkLoading || updateBookLoading;
  //   if (updateSuccess && !updateLoading) {
  //     handleClose();
  //   }
  // }, [updateSuccess, updateDrinkLoading, updateBookLoading]);

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
            <strong> Edit Voucher</strong>
          </Typography>
          <Divider />

          <Container sx={{ padding: headerPadding }} maxWidth="lg">
            <Grid container spacing={2}>
              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="voucher-id">Voucher ID</label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <TextField
                    variant="outlined"
                    id="voucher-id"
                    aria-describedby="my-helper-text"
                    fullWidth
                    value={voucherState?.id}
                    disabled
                  />
                </Grid>
              </Grid>

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
                    value={voucherState?.voucherName}
                    onChange={(e) => handleChangeText(e, 'voucherName')}
                    error={errorState.voucherName}
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
                    value={voucherState.correspondingRanking}
                    onChange={(e) =>
                      handleChangeText(e, 'correspondingRanking')
                    }
                    error={errorState.correspondingRanking}
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
                    value={round0(voucherState?.pointLoss)}
                    InputProps={{
                      inputComponent: NumberFormatCustom as any,
                    }}
                    onChange={(e) => handleChangeText(e, 'pointLoss')}
                    error={errorState.pointLoss}
                  // helperText={
                  //     errorState.pointLoss &&
                  //     'Point loss must be more than 0'
                  // }
                  />
                </Grid>
              </Grid>

              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="voucher-availability">Availability</label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <TextField
                    variant="outlined"
                    id="voucher-availability"
                    aria-describedby="my-helper-text"
                    fullWidth
                    value={
                      voucherState?.available ? 'Available' : 'Non-available'
                    }
                    onChange={(e) => handleChangeText(e, 'available')}
                  // helperText={
                  //     errorState.pointLoss &&
                  //     'Point loss must be more than 0'
                  // }
                  />
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
                  // helperText={
                  //   errorState.stockQuantity &&
                  //   'Discount amount must not be less than or equal to 0'
                  // }
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
                  // helperText={
                  //   errorState.stockQuantity &&
                  //   'Discount amount must not be less than or equal to 0'
                  // }
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
                // loading={updateDrinkLoading || updateBookLoading}
                loadingPosition="end"
                // onClick={() => handleSave()}
                endIcon={<SaveIcon />}
              >
                Save Changes{' '}
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
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
