import { Paper, TextField } from "@mui/material"


function Form(props) {
  return (
    <Paper component="form" onSubmit={props.handleSubmit} {...props}>
      {props.children}
    </Paper>
  );
}

Form.Input = TextField;

export default Form;