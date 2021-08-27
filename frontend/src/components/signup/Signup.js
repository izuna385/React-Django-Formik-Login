import React, { useContext, useState } from "react";
import { FormikContext, useFormik, ErrorMessage } from "formik";
import * as yup from "yup";
import axios from "axios";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  MutedLink,
  SubmitButton,
  FieldContainer,
  FieldError,
  FormError,
  FormSuccess
} from "../common";
import { withRouter } from "react-router-dom"; // new import
import { connect } from "react-redux"; // new import
import PropTypes from "prop-types"; // new import
import { signupNewUser } from "./SignupActions";
import { toast, ToastContainer } from "react-toastify";
const PASSWORD_REGEX = /^[a-z\d]{8,100}$/i;

const validationSchema = yup.object({
  userName: yup.string().min(3, "Please enter your user name").required("your user name is required"),
  // email: yup.string().email("Please enter valid email").required(),
  password: yup.string().matches(PASSWORD_REGEX, "Please enter strong password").required(),
  confirmPassword: yup.string().when("password", {
    is: val => ( val && val.length > 0 ? true : false ),
    then: yup.string().oneOf([yup.ref("password")], "Check the password")
  })

})

const Signup = (props) => {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");
  const [signupError, setSignupError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(null);


  // values: {userName: "", email: "", password: "", cofirmPassword: ""}
  const onSubmit = async (values) => {
    const postedData = {
      username: values.userName,
      // email: values.email,
      password: values.password
    }
    console.log("postedData", postedData);
    // signupNewUser(postedData);
    // aaaaa@ggggggg.com
    const response = await axios.post("/api/v1/users/", postedData).catch((err) => {
      if (err && err.response) {
       setError(err.response.data.message);
       console.log(err.message);
       toast.error(JSON.stringify(err.response.data.message));
       setSignupError(err.message);
      }
      setSuccess(null);
    });

  if (response && response.data){
    setError(null);
    console.log('success!', response.data.message);
    setSignupSuccess("Signup Success!");
    setSuccess(response.data.message);
    formik.resetForm()
  }
  }

  const formik = useFormik(
    { initialValues: {userName: "",
        // email: "",
        password: "",
        cofirmPassword: ""},
    validateOnBlur: true,
    onSubmit,
    validationSchema: validationSchema
  })

  return (
    <BoxContainer>
      <ToastContainer />
      <h1>Signup</h1>
      {!error && <FormSuccess>{success ? success: ""}</FormSuccess>}
      {!success && <FormError>{error ? error: ""}</FormError>}
      <FormContainer onSubmit={formik.handleSubmit}>
        <FieldContainer>
        <Input name="userName" type="text" placeholder="user name" value={formik.values.userName} onChange={formik.handleChange}
        onBlur={formik.handleBlur}/>
        </FieldContainer>
        <FieldError>{formik.touched.userName && formik.errors.userName ? formik.errors.userName : ""}</FieldError>
        {/*<FieldContainer>*/}
        {/*<Input name="email" type="email" placeholder="Email" value={formik.values.email} onChange={formik.handleChange}*/}
        {/*onBlur={formik.handleBlur}/>*/}
        {/*</FieldContainer>*/}
        {/*<FieldError>{formik.touched.email && formik.errors.email ? formik.errors.email : ""}</FieldError>*/}
        <FieldContainer>
        <Input name="password" type="password" placeholder="Password" value={formik.values.password} onChange={formik.handleChange}
        onBlur={formik.handleBlur}/>
        </FieldContainer>
        <FieldError>{formik.touched.password && formik.errors.password ? formik.errors.password : ""}</FieldError>
        <FieldContainer>
        <Input name="confirmPassword" type="password" placeholder="Confirm Password" value={formik.values.confirmPassword} onChange={formik.handleChange}
        onBlur={formik.handleBlur}/>
        </FieldContainer>
        <FieldError>{formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : ""}</FieldError>
        <SubmitButton type="submit" disabled={!formik.isValid}>Signup</SubmitButton>
        {/* you have to contain submit button in inner FormContainer */}

        {!success && signupError && (  // then if changed flag is false show error message
             <div style={{ color: "red" }}>
               <span>{signupError}</span>
             </div>

        )}
        {!error && signupSuccess && (  // then if changed flag is false show error message
             <div style={{ color: "blue" }}>
               <span>{signupSuccess}</span>
             </div>

        )}
      </FormContainer>
    </BoxContainer>
  );
}

// export default Signup;

Signup.propTypes = {
  signupNewUser: PropTypes.func.isRequired,
  createUser: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  createUser: state.createUser
});

export default connect(mapStateToProps, {
  signupNewUser
})(withRouter(Signup));