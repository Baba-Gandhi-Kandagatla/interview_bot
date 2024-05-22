import { TextField } from "@mui/material";
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
type Props = {
    name: string;
    type: string;
    label: string;
};



export const CustomizedDropDown = (props: Props) => {
  const [Type, setType] = React.useState('');
  const handleChange = (event:SelectChangeEvent) => {
    setType(event.target.value as string);
  };
      return (
        <FormControl fullWidth>
        <InputLabel id="haveHavenot" >Worked on projects related to this subject</InputLabel>
        <Select
          labelId="haveHavenot"
          id="haveHavenot"
          value={Type}
          label={props.label}
          name={props.name}
          onChange={handleChange}
          sx={{color:"white"}}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 48 * 4.5 + 8,
                width: 250,
                color:"white",
                backgroundColor:"black"
              },
            }}}
        >
          <MenuItem value='Have'>Yes</MenuItem>
          <MenuItem value='Have not'>No</MenuItem>
        </Select>
      </FormControl>
    );
  };

export const CustomizedInput = (props: Props) => {
  return (
      <TextField
        margin="normal"
        InputLabelProps={{ style: { color: "white" } }}
        name={props.name}
        label={props.label}
        type={props.type}
        InputProps={{
          style: {
            width: "400px",
            borderRadius: 10,
            fontSize: 20,
            color: "white",
          },
        }}
      />
    );
  };
    
  export const CustomizedDropDown1 = (props: Props) => {
    const [Type, setType] = React.useState('');
    const handleChange = (event:SelectChangeEvent) => {
      setType(event.target.value as string);
    };
        return (
          <FormControl margin="normal" fullWidth>
          <InputLabel  id="typeofinterview" >Type of Interview</InputLabel>
          <Select
            labelId="typeofinterview"
            id="typeofinterview"
            value={Type}
            label={props.label}
            name={props.name}
            onChange={handleChange}
            sx={{color:"white"}}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  width: 250,
                  color:"white",
                  backgroundColor:"black"
                },
              }}}
          >
            <MenuItem value='Technical'>Technical</MenuItem>
            <MenuItem value='Scenario-Based'>Scenario-Based</MenuItem>
            <MenuItem value='Behavioral'>Behavioral</MenuItem>
          </Select>
        </FormControl>
      );
    };
