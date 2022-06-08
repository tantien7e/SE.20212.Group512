import {
  addBook,
  selectBooksLoading,
} from '@app/app/features/books/books-slice';
import {
  addDrink,
  selectDrinksAddLoading,
} from '@app/app/features/drinks/drinks-slice';
import { InventoryType } from '@app/constants';
import { BookInterface, DrinkInterface } from '@app/models/product.interface';
import { round2 } from '@app/utils';
import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';
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
import * as React from 'react';
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
  item?: DrinkInterface | BookInterface;
  type: InventoryType;
}

interface ProductStateInterface {
  imageUrl: string;
  productId: string;
  productName: string;
  price: number;
  stockQuantity: number;
  author?: string;
}

export interface ErrorStateInterface {
  imageUrl: boolean;
  productId?: boolean;
  productName: boolean;
  price: boolean;
  stockQuantity: boolean;
  author?: boolean;
}

export default function AddItemModal(props: EditCartModalPropsInterface) {
  const dispatch = useDispatch();
  const drinksLoading = useSelector(selectDrinksAddLoading);
  const booksLoading = useSelector(selectBooksLoading);
  const [addSuccess, setAddSuccess] = useState(false);
  const { open, handleClose, type } = props;

  const [productState, setProductState] = useState<ProductStateInterface>({
    imageUrl: '',
    productId: '',
    productName: '',
    price: 0,
    stockQuantity: 0,
    author: '',
  });

  const [errorState, setErrorState] = useState<ErrorStateInterface>({
    imageUrl: false,
    productName: false,
    price: false,
    stockQuantity: false,
    author: false,
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
    const isNumberField = field === 'price' || field === 'stockQuantity';

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
    const { productName, price, stockQuantity, author, imageUrl } = body;
    if (type === InventoryType.DRINK) {
      return {
        name: productName,
        price,
        stock: stockQuantity,
        imageUrl,
      };
    } else if (type === InventoryType.BOOK) {
      return {
        title: productName,
        author: author || '',
        stock: stockQuantity,
        price,
        imageUrl
      };
    }
    return {};
  };

  const handleAdd = () => {
    const { imageUrl, productName, price, stockQuantity, author } =
      productState;
    const error = {
      imageUrl: !imageUrl,
      productName: !productName,
      price: price <= 0,
      stockQuantity: stockQuantity <= 0,
      author: type === InventoryType.BOOK ? !author : false,
    };
    setErrorState(error);
    const passable = !(Object.values(error).findIndex((item) => item) > -1);
    if (!passable) return;
    const data = generatePostData(productState);
    if (type === InventoryType.DRINK) {
      dispatch(addDrink(data as DrinkInterface));
    }
    if (type === InventoryType.BOOK) {
      dispatch(addBook(data as BookInterface));
    }
    setAddSuccess(true);
  };

  React.useEffect(() => {
    const loading = drinksLoading || booksLoading;
    if (addSuccess && !loading) {
      handleClose();
    }
  }, [addSuccess, drinksLoading, booksLoading]);

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
            <strong style={{ textTransform: 'capitalize' }}>
              Add {type.toLowerCase()}
            </strong>
          </Typography>
          <Divider />
          <Box
            sx={{
              padding: `${theme.spacing(2)} 0`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {productState.imageUrl && (
              <img
                src={productState.imageUrl}
                alt={'item image'}
                style={{
                  height: '256px',
                  maxHeight: '50vh',
                  borderRadius: '8px',
                  margin: `${theme.spacing(2)} 0`,
                }}
              />
            )}
            <br />
            <label htmlFor="contained-button-file">
              <Input
                accept="image/*"
                id="contained-button-file"
                multiple
                type="file"
                onChange={handleChangeImage}
              />
              <Button variant="contained" component="span">
                Upload New Image
              </Button>
              {errorState.imageUrl && (
                <FormHelperText error={errorState.imageUrl}>
                  Image must not be empty
                </FormHelperText>
              )}
            </label>
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
                    helperText={
                      errorState.productName && 'Product Name must not be empty'
                    }
                  />
                </Grid>
              </Grid>

              {type === InventoryType.BOOK && (
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
                    onChange={(e) => handleChangeText(e, 'price')}
                    error={errorState.price}
                    helperText={
                      errorState.price &&
                      'Price must not be less than or equal to 0'
                    }
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
              {' '}
              <LoadingButton
                variant="contained"
                loading={drinksLoading || booksLoading}
                loadingPosition="end"
                onClick={() => handleAdd()}
                endIcon={<AddIcon />}
              >
                Add{' '}
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
