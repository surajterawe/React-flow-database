import { FormControl, FormLabel, Select, TextField } from "@mui/material";
import { withStyles } from "@mui/styles";

export const FormLabelComponent = withStyles((theme) => ({
  root : {
    fontFamily: "Roboto, Arial, sans-serif",
    marginBottom: "2px",
    fontSize: "14px!important",
    color: "#000!important",
  }
}))(({classes, label="",children,...props}) => {
  return <FormLabel className={classes.root}>{children}</FormLabel>
})

export const OutlinedTextfield = withStyles({
  root: {
    fontFamily: "Roboto, Arial, sans-serif",
    "&.MuiFormControl-root": {
      margin: "0",
      border: "2px solid rgb(209, 209, 209)",
      borderRadius: "4px",
    },
    "& .MuiOutlinedInput-root": {
      margin: 0,
    },

    "&.MuiInputBase-input": {
      border: "none",
      padding: "6px 8px",
      fontSize: "14px",
    },
    "& fieldset": {
      display: "none",
    },
  },
})(({ classes, label = "", ...props }) => {
  return (
    <FormControl>
      <FormLabelComponent>{label}</FormLabelComponent>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        className={classes.root}
        {...props}
      />
    </FormControl>
  );
});

export const OutlinedSelect = withStyles((theme) => ({
  root: {
    backgroundColor: "white !important",
    border: "2px solid rgb(209, 209, 209)",
    borderColor: theme()?.palette?.primary?.main,
  },
}))(({ classes, label = "", children, ...props }) => {
  return (
    <FormControl>
      <FormLabelComponent>{label}</FormLabelComponent>
      <Select className={classes.root} {...props}>
        {children}
      </Select>
    </FormControl>
  );
});


