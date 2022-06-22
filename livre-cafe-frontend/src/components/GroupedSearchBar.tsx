import { CustomerInterface } from '@app/models';
import { Search } from '@mui/icons-material';
import {
  Button,
  ClickAwayListener,
  Grid,
  InputAdornment,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';

interface GroupedSearchBarProps {
  rows: CustomerInterface[];
  onSearchChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  filterText: string;
  handleSelect: (option: CustomerInterface) => void;
  selectedValue?: CustomerInterface;
}

export default function GroupedSearchBar(props: GroupedSearchBarProps) {
  const { rows, onSearchChange, filterText, handleSelect, selectedValue } =
    props;
  const theme = useTheme();
  const options = rows.map((row) => {
    const firstLetter = row.firstName[0];
    return {
      firstLetter: /\d/.test(firstLetter) ? '0-9' : firstLetter,
      ...row,
    };
  });

  const [open, setOpen] = React.useState(false);

  const sortedOptions = options.sort(
    (a, b) => -b.firstLetter.localeCompare(a.firstLetter),
  );
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Autocomplete
        id="grouped-demo"
        options={sortedOptions}
        groupBy={(option) => option.firstLetter}
        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
        clearOnBlur={false}
        open={open}
        renderOption={(optionProps, option, state) => {
          return (
            <Button
              fullWidth
              sx={{ px: 2, textTransform: 'none', fontWeight: '400' }}
              onClick={() => {
                handleSelect(option);
                setOpen(false);
              }}
            >
              <Grid
                container
                direction="column"
                alignItems="start"
                color={theme.palette.secondary.contrastText}
                rowSpacing={1}
              >
                <Grid item>
                  <Typography>
                    <strong>{option.firstName} </strong> {`${option.lastName}`}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>+{option.phone}</Typography>
                </Grid>
                <Grid item>
                  <Typography>{option.email} </Typography>
                </Grid>
              </Grid>
            </Button>
          );
        }}
        filterOptions={(options) => options}
        popupIcon={null}
        sx={{ width: 400 }}
        inputValue={filterText}
        renderInput={(params) => {
          const { InputProps } = params;
          return (
            <TextField
              placeholder="Search by name, phone"
              onClick={() => setOpen(true)}
              onChange={onSearchChange}
              {...params}
              InputProps={{
                ...InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          );
        }}
      />
    </ClickAwayListener>
  );
}
