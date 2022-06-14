import { PREFIX_URL } from '@app/constants';
import { CartStateInterface, Store } from '@app/context/Store';
import { BookInterface, DrinkInterface } from '@app/models/product.interface';
import { numberWithCommasRound2, round2 } from '@app/utils';
import { toastError, toastInformSuccess } from '@app/utils/toast';
import { Button, Container, Divider, Grid, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';
import NumberFormat from 'react-number-format';

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

interface EditCartModalPropsInterface {
  open: boolean;
  handleClose: () => void;
  item?: DrinkInterface & BookInterface;
}

interface ProductCartStateInterface {
  imageUrl: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  additionalRequirement: string;
  author?: string;
}

export default function AddToCartModal(props: EditCartModalPropsInterface) {
  const { open, handleClose, item } = props;
  const { state, dispatch: ctxDispatch } = React.useContext(Store);

  const findCartItem = (
    currentState: CartStateInterface,
    newItem?: DrinkInterface | BookInterface,
  ) =>
    currentState.cart.cartItems.find(
      (cartItem) => newItem?._id === cartItem._id,
    );
  const handleAddToCart = (
    product?: DrinkInterface | BookInterface,
    addedQuantity = 1,
    additionalRequirement = '',
  ) => {
    if (!product) return;
    const existItem = state?.cart?.cartItems?.find(
      (cartItem: DrinkInterface & { quantity: number }) =>
        cartItem._id === product?._id,
    );
    if (addedQuantity < 1) {
      toastError('Quantity must be more than 0!');
      return;
    }
    const quantity = existItem
      ? Number(existItem.quantity) + Number(addedQuantity)
      : Number(addedQuantity);

    ctxDispatch({
      type: 'CART_UPDATE_ITEM_QUANTITY',
      payload: {
        ...product,
        quantity,
        additionalRequirement,
      },
    });
    if (quantity > product?.stock) {
      console.log('Bigger', quantity, product.stock);
      toastError('Out of stock!');
      return;
    }

    toastInformSuccess('Successfully added!');
  };
  const handleAdd = () => {
    handleAddToCart(
      item,
      productState.quantity,
      productState.additionalRequirement,
    );
    handleClose();
  };

  const [productState, setProductState] = useState<ProductCartStateInterface>({
    imageUrl: item?.imageUrl || '',
    productId: item?._id || '',
    productName: item?.name || item?.title || '',
    price: item?.price || 0,
    quantity: 1,
    additionalRequirement:
      findCartItem(state, item)?.additionalRequirement || '',
    author: item?.author,
  });
  const theme = useTheme();
  const headerPadding = `${theme.spacing(2)} 0`;

  const handleChangeText = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    field: keyof ProductCartStateInterface,
  ) => {
    setProductState((prevState) => {
      return { ...prevState, [field]: e.target.value };
    });
  };

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
            style={{ padding: ` ${theme.spacing(1)} 0` }}
            color={theme.palette.secondary.contrastText}
          >
            <strong> Add To Cart</strong>
          </Typography>
          <Divider />
          <Box sx={{ padding: `${theme.spacing(2)} 0`, display: 'flex' }}>
            {/* <Typography variant="body1">
              <strong>Product Image</strong>
            </Typography> */}
            {productState.imageUrl && (
              <img
                src={productState.imageUrl}
                alt={'item image'}
                style={{
                  height: '256px',
                  maxHeight: '50vh',
                  borderRadius: '8px',
                  margin: `${theme.spacing(2)} auto`,
                }}
              />
            )}
            <br />
          </Box>
          <Divider />
          <Typography
            variant="h6"
            style={{ padding: ` ${theme.spacing(1)} 0` }}
            color={theme.palette.secondary.contrastText}
          >
            <strong> Product Info</strong>
          </Typography>
          <Divider />
          <Container sx={{ padding: headerPadding }} maxWidth="lg">
            <Grid container spacing={2}>
              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="product-id">Product ID</label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <TextField
                    variant="outlined"
                    id="product-id"
                    aria-describedby="my-helper-text"
                    fullWidth
                    value={productState?.productId}
                    disabled
                  />
                </Grid>
              </Grid>

              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="product-name">Product Name</label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <TextField
                    variant="outlined"
                    id="product-name"
                    aria-describedby="my-helper-text"
                    fullWidth
                    value={productState?.productName}
                    disabled
                  />
                </Grid>
              </Grid>

              {productState?.author && (
                <Grid container item alignItems="center">
                  <Grid xs={3}>
                    <label htmlFor="product-author">Author</label>
                  </Grid>
                  <Grid xs sx={{ maxWidth: 400 }}>
                    <TextField
                      variant="outlined"
                      id="product-author"
                      aria-describedby="my-helper-text"
                      fullWidth
                      value={productState?.author}
                      disabled
                    />
                  </Grid>
                </Grid>
              )}

              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="product-price">Price</label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <TextField
                    variant="outlined"
                    id="product-price"
                    aria-describedby="my-helper-text"
                    fullWidth
                    value={round2(productState?.price)}
                    InputProps={{
                      startAdornment: '$',
                      inputComponent: NumberFormatCustom as any,
                    }}
                    disabled
                  />
                </Grid>
              </Grid>
              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="product-stock">Quantity</label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <TextField
                    variant="outlined"
                    id="product-stock"
                    aria-describedby="my-helper-text"
                    fullWidth
                    value={productState?.quantity}
                    onChange={(e) => handleChangeText(e, 'quantity')}
                    InputProps={{
                      // inputMode: 'numeric',
                      inputComponent: NumberFormatCustom as any,
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="product-requirement">
                    Additional Requirements
                  </label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <TextField
                    variant="outlined"
                    id="product-requirement"
                    aria-describedby="my-helper-text"
                    fullWidth
                    value={productState?.additionalRequirement}
                    onChange={(e) =>
                      handleChangeText(e, 'additionalRequirement')
                    }
                    // disabled
                  />
                </Grid>
              </Grid>
            </Grid>
          </Container>
          <Divider />

          <Grid container justifyContent={'space-between'}>
            <Typography
              variant="h6"
              style={{ padding: ` ${theme.spacing(1)} 0` }}
              color={theme.palette.secondary.contrastText}
            >
              <strong> Cost: </strong>
            </Typography>
            <Typography
              variant="h6"
              style={{ padding: ` ${theme.spacing(1)} 0` }}
            >
              {' $'}
              {numberWithCommasRound2(
                productState.quantity * productState.price,
              )}
            </Typography>
          </Grid>
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
              {' '}
              <Button variant="contained" onClick={() => handleAdd()}>
                Add To Cart
              </Button>
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
