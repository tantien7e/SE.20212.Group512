import { PREFIX_URL } from '@app/constants';
import { BookInterface, DrinkInterface } from '@app/types/product.interface';
import { round2 } from '@app/utils';
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
  item?: DrinkInterface & BookInterface;
}

interface ProductStateInterface {
  imageUrl: string;
  productId: string;
  productName: string;
  price: number;
  stockQuantity: number;
  author?: string;
}

export default function EditInventoryModal(props: EditCartModalPropsInterface) {
  const { open, handleClose, item } = props;

  const [productState, setProductState] = useState<ProductStateInterface>({
    imageUrl: item?.imageUrl || PREFIX_URL + item?.imageLink,
    productId: item?._id || '',
    productName: item?.name || item?.title || '',
    price: item?.price || 0,
    stockQuantity: item?.stock || 0,
    author: item?.author,
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
            color={theme.palette.secondary.contrastText}
            style={{ padding: ` ${theme.spacing(1)} 0` }}
          >
            <strong> Edit Product</strong>
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
              <Button variant="contained" onClick={() => handleClose()}>
                Save Changes
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
