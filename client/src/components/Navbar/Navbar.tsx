import { useState } from 'react';
import { Tabs, Tab, Box } from '../../MUI';
import { useDispatch } from 'react-redux';
import { showall, showdone, showundone } from '../../redux/todoSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue === 0) dispatch(showall());
    if (newValue === 1) dispatch(showdone());
    if (newValue === 2) dispatch(showundone());
  };

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        justifyContent: 'center',
        display: 'flex',
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab label="All todos" />
        <Tab label="Done" />
        <Tab label="Yet to be done" />
      </Tabs>
    </Box>
  );
}
