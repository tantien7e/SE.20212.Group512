import { selectCustomersAddLoading } from '@app/app/features/customers/customers-slice';
import {
  selectStaffsUpdateLoading,
  updateStaff,
} from '@app/app/features/staffs/staffs-slice';
import PhoneInputCustom from '@app/components/PhoneInputCustom';
import { StaffPostData, StaffResponse } from '@app/models/user.interface';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
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
import React, { useEffect, useState } from 'react';
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

interface EditModalProps {
  open: boolean;
  handleClose: () => void;
  item: StaffResponse;
}

// interface StaffState {
//   firstName: string;
//   lastName: string;
//   phone: string;
//   email: string;
//   points: number;
//   ranking: RankType;
//   gender: CustomerGender;
// }

export interface ErrorStateInterface {
  firstName: boolean;
  phone: boolean;
  imageUrl?: boolean;
}

export default function EditStaffModal(props: EditModalProps) {
  const dispatch = useDispatch();
  const staffLoading = useSelector(selectStaffsUpdateLoading);
  const [addSuccess, setAddSuccess] = useState(false);
  const { open, handleClose, item } = props;

  const [staffState, setStaffState] = useState<StaffPostData>({
    _id: item._id,
    firstName: item.firstName,
    lastName: item.lastName || '',
    phone: item.phone,
    isManager: item.isManager,
    imageUrl: item.imageUrl,
  });

  const [errorState, setErrorState] = useState<ErrorStateInterface>({
    firstName: false,
    phone: false,
  });
  const theme = useTheme();
  const headerPadding = `${theme.spacing(2)} 0`;

  const handleChangeText = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      | SelectChangeEvent,
    field: keyof StaffPostData,
    country?: CountryData,
  ) => {
    setStaffState((prevState) => {
      let value = e.target.value;
      // if (field === 'gender' && e.target.value === CustomerGender.NA)
      //   value = '';
      return {
        ...prevState,
        [field]: value,
      };
    });
    let phoneValue = '';
    if (field === 'phone') {
      const valueCopy = e.target.value.slice();
      const regex = new RegExp(`^${country?.dialCode}`);
      phoneValue = valueCopy.replace(regex, '');
    }
    setErrorState((prevState) => {
      return {
        ...prevState,
        [field]: field === 'phone' ? !phoneValue : !e.target.value,
      };
    });
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files?.[0];
    reader.onloadend = () => {
      setStaffState((state) => ({
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

  // const generatePostData = (body: StaffResponse): staff => {
  //   return {
  //     firstName: body.firstName,
  //     lastName: body.lastName,
  //     phone: body.phone,
  //     email: body.email,
  //     rankingPoints: Number(body.points),
  //     exchangeablePoints: Number(body.points),
  //     gender: body.gender,
  //     ordersHistory: [],
  //   };
  // };

  const handleSave = () => {
    const { firstName, phone, imageUrl } = staffState;
    const error = {
      firstName: !firstName,
      phone: !phone,
      imageUrl: !imageUrl,
    };
    setErrorState({ ...error });
    const passable = !(Object.values(error).findIndex((item) => item) > -1);
    if (!passable) return;
    dispatch(updateStaff(staffState as StaffPostData));
    setAddSuccess(true);
  };

  useEffect(() => {
    if (addSuccess && !staffLoading) {
      handleClose();
    }
  }, [addSuccess, staffLoading]);

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
            <strong style={{ textTransform: 'capitalize' }}>Edit Staff</strong>
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
            {staffState.imageUrl && (
              <img
                src={staffState.imageUrl}
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
            {errorState.imageUrl && (
              <FormHelperText error={errorState.imageUrl}>
                Image must not be empty
              </FormHelperText>
            )}
          </Box>
          <Divider />
          <Typography
            variant="h6"
            style={{ padding: ` ${theme.spacing(1)} 0` }}
            color={theme.palette.secondary.contrastText}
          >
            <strong> Staff Info</strong>
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
                    value={staffState?._id}
                    disabled
                  />
                </Grid>
              </Grid>
              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="first-name">
                    <Grid container>
                      <Typography>First Name</Typography>{' '}
                      <Typography color="error">*</Typography>
                    </Grid>
                  </label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <TextField
                    variant="outlined"
                    id="first-name"
                    aria-describedby="my-helper-text"
                    fullWidth
                    value={staffState?.firstName}
                    onChange={(e) => handleChangeText(e, 'firstName')}
                    error={errorState.firstName}
                    helperText={
                      errorState.firstName && 'First Name must not be empty'
                    }
                  />
                </Grid>
              </Grid>
              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="last-name">Last Name</label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  <TextField
                    variant="outlined"
                    id="last-name"
                    aria-describedby="my-helper-text"
                    fullWidth
                    value={staffState?.lastName}
                    onChange={(e) => handleChangeText(e, 'lastName')}
                  />
                </Grid>
              </Grid>
              <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="phone">
                    <Grid container>
                      <Typography>Phone</Typography>{' '}
                      <Typography color="error">*</Typography>
                    </Grid>
                  </label>
                </Grid>
                <Grid xs sx={{ maxWidth: 400 }}>
                  {/* <TextField
                        variant="outlined"
                        id="phone"
                        aria-describedby="my-helper-text"
                        fullWidth
                        value={staffState?.phone}
                        onChange={(e) => handleChangeText(e, 'phone')}
                        error={errorState.phone}
                        helperText={errorState.phone && 'Phone must not be empty'}
                        InputProps={{
                          // inputMode: 'numeric',
                          inputComponent: PhoneInputCustom as any,
                        }}
                        // inputProps={{
                        //   thousandSeparator: false,
                        // }}
                      /> */}
                  <PhoneInputCustom
                    onChange={(value, country: CountryData) => {
                      const event = {
                        target: {
                          value: value,
                        },
                      };

                      handleChangeText(event as any, 'phone', country);
                    }}
                    error={errorState.phone}
                    value={item?.phone || ''}
                  />
                </Grid>
              </Grid>

              {/* <Grid container item alignItems="center">
                <Grid xs={3}>
                  <label htmlFor="points">Gender</label>
                </Grid>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={staffState.gender}
                  onChange={(e) => handleChangeText(e, 'gender')}
                >
                  <MenuItem value={CustomerGender.FEMALE}>Female</MenuItem>
                  <MenuItem value={CustomerGender.MALE}>Male</MenuItem>
                  <MenuItem value={CustomerGender.NA}>N/A</MenuItem>
                </Select>
              </Grid> */}
            </Grid>
          </Container>{' '}
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
                loading={staffLoading}
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
        {...other}
      />
    );
  },
);
