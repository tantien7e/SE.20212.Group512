import { BookInterface, DrinkInterface } from '@app/types/product.interface';
import {
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '800px',
  bgcolor: 'background.paper',
  border: '1px solid #000',
  borderRadius: '8px',
  boxShadow: 24,
  maxHeight: 'calc(100vh - 32px)',
  p: 4,
};

const Input = styled('input')({
  display: 'none',
});

interface EditCartModalPropsInterface {
  open: boolean;
  handleClose: () => void;
  item?: DrinkInterface | BookInterface;
}

interface ProductStateInterface {
  imageUrl: string;
  productId: string;
  productName: string;
}

export default function EditCartModal(props: EditCartModalPropsInterface) {
  const { open, handleClose, item } = props;

  const [productState, setProductState] = useState<ProductStateInterface>({
    imageUrl: item?.picture || item?.imageLink,
    productId: item?._id || '',
    productName: item?.name || item?.title || '',
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
          >
            <strong> Edit Product</strong>
          </Typography>
          <Divider />
          <Box sx={{ padding: `${theme.spacing(2)} 0` }}>
            <Typography variant="body1">
              <strong>Gain more impression with a clean image</strong>
            </Typography>
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
                  />
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Modal>
    </div>
  );
}
