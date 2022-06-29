import {
  selectBooksUpdateLoading,
  updateBook,
} from '@app/app/features/books/books-slice';
import {
  selectDrinksUpdateLoading,
  updateDrink,
} from '@app/app/features/drinks/drinks-slice';
import { ErrorStateInterface } from '@app/components/AddItemModal';
import { InventoryType, PREFIX_URL } from '@app/constants';
import { CartAction, CartItemInterface, Store } from '@app/context/Store';
import { BookInterface, DrinkInterface } from '@app/models/product.interface';
import { round2 } from '@app/utils';
import { toastError, toastInformSuccess } from '@app/utils/toast';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Container,
  Divider,
  FormHelperText,
  Grid,
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

interface EditCartModalPropsInterface {
  open: boolean;
  handleClose: () => void;
  item: CartItemInterface;
}

interface ProductStateInterface {
  _id: string;
  imageUrl: string;
  productId: string;
  productName: string;
  price: number;
  cost: number;
  stockQuantity: number;
  author?: string;
  quantity: number;
  additionalRequirements?: string;
}

export default function EditCartModal(props: EditCartModalPropsInterface) {
  const { open, handleClose, item } = props;
  const updateDrinkLoading = useSelector(selectDrinksUpdateLoading);
  const updateBookLoading = useSelector(selectBooksUpdateLoading);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { dispatch } = useContext(Store);
  const [productState, setProductState] = useState<ProductStateInterface>({
    _id: item?._id || '',
    imageUrl: item?.imageUrl || '',
    productId: item?._id || '',
    productName: item?.name || item?.title || '',
    cost: item?.cost || 0,
    quantity: item?.quantity || 0,
    stockQuantity: item?.stock || 0,
    author: item?.author,
    additionalRequirements: item?.additionalRequirements || '',
    price: item?.price || 0,
  });

  const [errorState, setErrorState] = useState<ErrorStateInterface>({
    productId: false,
    productName: false,
    cost: false,
    stockQuantity: false,
    author: false,
    quantity: false,
  });

  const theme = useTheme();
  const headerPadding = `${theme.spacing(2)} 0`;

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files?.[0];
    reader.onloadend = () => {
      setProductState((state) => ({
        ...state,
        imageUrl: reader.result as string,
      }));
      setErrorState((state) => ({
        ...state,
        imageUrl: !reader.result,
      }));
    };
    if (!file) {
      return;
    }
    reader.readAsDataURL(file);
  };

  const handleChangeText = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    field: keyof ProductStateInterface,
  ) => {
    const isNumberField = field === 'cost' || field === 'stockQuantity';
    setProductState((prevState) => {
      return { ...prevState, [field]: e.target.value };
    });
    setErrorState((prevState) => {
      return {
        ...prevState,
        [field]: !isNumberField ? !e.target.value : !Number(e.target.value),
      };
    });
  };

  const generatePostData = (body: ProductStateInterface) => {
    const {
      productName,
      cost,
      stockQuantity,
      author,
      imageUrl,
      _id,
      quantity,
      additionalRequirements,
    } = body;

    return {};
  };

  const genPostItem = (
    productState: ProductStateInterface,
  ): CartItemInterface => {
    const {
      productName,
      price,
      stockQuantity,
      author,
      imageUrl,
      _id,
      quantity,
      additionalRequirements,
    } = productState;

    const postItem = {
      _id: _id,
      name: productName,
      stock: stockQuantity,
      price: price,
      author: author,
      imageUrl: imageUrl,
      additionalRequirements: additionalRequirements,
      quantity: Number(quantity),
    };

    return postItem as CartItemInterface;
  };

  const handleSave = () => {
    const {
      imageUrl,
      productId,
      productName,
      cost,
      stockQuantity,
      author,
      quantity,
      additionalRequirements,
    } = productState;

    const error = {
      productId: !productId,
      productName: !productName,
      cost: cost <= 0,
      stockQuantity: stockQuantity <= 0,
      quantity: quantity < 0,
    };
    setErrorState(error);
    const passable = !(Object.values(error).findIndex((item) => item) > -1);

    console.log(error);
    if (!passable) return;
    const newItem = genPostItem(productState);
    dispatch({ type: CartAction.CART_UPDATE_ITEM_QUANTITY, payload: newItem });
    if (newItem.quantity > newItem.stock) {
      toastError('Out of stock');
      handleClose();
      return;
    }
    toastInformSuccess('Changes saved!');
    handleClose();
  };

  React.useEffect(() => {
    const updateLoading = updateDrinkLoading || updateBookLoading;
    if (updateSuccess && !updateLoading) {
      handleClose();
    }
  }, [updateSuccess, updateDrinkLoading, updateBookLoading]);

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
            <strong> Edit Cart Item</strong>
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
                    onChange={(e) => handleChangeText(e, 'productName')}
                    error={errorState.productName}
                    // helperText={
                    //   errorState.productName && 'Product Name must not be empty'
                    // }
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
                      onChange={(e) => handleChangeText(e, 'author')}
                      error={errorState.author}
                      helperText={
                        errorState.author && 'Author must not be empty'
                      }
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
                    value={round2(productState?.cost)}
                    InputProps={{
                      startAdornment: '$',
                      inputComponent: NumberFormatCustom as any,
                    }}
                    onChange={(e) => handleChangeText(e, 'cost')}
                    error={errorState.cost}
                    helperText={
                      errorState.cost &&
                      'Price must not be less than or equal to 0'
                    }
                    disabled
                  />
                </Grid>
              </Grid>
              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="product-stock">Stock Quantity</label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <TextField
                    variant="outlined"
                    id="product-stock"
                    aria-describedby="my-helper-text"
                    fullWidth
                    value={productState?.stockQuantity}
                    onChange={(e) => handleChangeText(e, 'stockQuantity')}
                    InputProps={{
                      // inputMode: 'numeric',
                      inputComponent: NumberFormatCustom as any,
                    }}
                    error={errorState.stockQuantity}
                    helperText={
                      errorState.stockQuantity &&
                      'Stock must not be less than or equal to 0'
                    }
                    disabled
                  />
                </Grid>
              </Grid>

              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="product-quantity">Quantity</label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <TextField
                    variant="outlined"
                    id="product-quantity"
                    aria-describedby="my-helper-text"
                    fullWidth
                    value={productState?.quantity}
                    InputProps={{
                      inputComponent: NumberFormatCustom as any,
                    }}
                    onChange={(e) => handleChangeText(e, 'quantity')}
                    error={errorState.quantity}
                    helperText={
                      errorState.quantity &&
                      'Quantity must not be less than or equal to 0'
                    }
                  />
                </Grid>
              </Grid>

              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="product-additionalRequirements">
                    Additional Requirement
                  </label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <TextField
                    variant="outlined"
                    id="product-additionalRequirements"
                    aria-describedby="my-helper-text"
                    fullWidth
                    value={productState?.additionalRequirements}
                    onChange={(e) =>
                      handleChangeText(e, 'additionalRequirements')
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
                loading={updateDrinkLoading || updateBookLoading}
                loadingPosition="end"
                onClick={() => handleSave()}
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
