import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { Checkbox, Typography } from '@mui/material';
import { getBackgroundColor } from '@app/utils';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const genVoucher = (
  name: string,
  color: string,
  points: number,
  discount: number,
) => {
  return {
    name,
    color,
    points,
    discount,
  };
};

const rows = [
  genVoucher('Blaze Flame Voucher', 'red', 100, 10),
  genVoucher('Honor Chosen Voucher', 'yeallow', 150, 15),
  genVoucher('Progentinor Voucher', 'green', 500, 55),
];

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function VoucherSelect() {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{ maxWidth: 300 }} fullWidth>
        <InputLabel id="demo-multiple-chip-label">Select Vouchers</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={
            <OutlinedInput id="select-multiple-chip" label="Select Vouchers" />
          }
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {rows.map((row) => (
            <MenuItem
              key={row.name}
              value={row.name}
              style={getStyles(row.name, personName, theme)}
            >
              <VoucherOption {...row} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

interface VoucherOptionProps {
  name: string;
  points: number;
  color: string;
  discount: number;
}

function VoucherOption(props: VoucherOptionProps) {
  const { name, points, color, discount } = props;

  return (
    <Box
      p={2}
      sx={{ backgroundColor: getBackgroundColor(color), width: '100%' }}
    >
      <Typography color={color}>{name}</Typography>
    </Box>
  );
}
