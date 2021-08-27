import React, { useContext, useState } from "react";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  MutedLink,
  SubmitButton,
  FieldContainer,
  FieldError,
  FormError
} from "../common";
import { useFormik } from "formik";
import * as yup from  "yup";
import axios from "axios";
import { withRouter } from "react-router-dom";  // new import
import { connect } from "react-redux";          // new import
import PropTypes from "prop-types";             // new import
import { Link } from "react-router-dom";
import { Container, Button, Row, Col, Form } from "react-bootstrap";

import {setAxiosAuthToken, toastOnError} from "../../utils/Utils";
import {getCurrentUser, setToken, unsetCurrentUser} from "./LoginActions";      // new import

const validationSchema = yup.object(
  {userName: yup.string().required(),
   password: yup.string().required()}
)

const login = (userData, redirectTo) => async dispatch => {
    try {
        const response = await axios.post("/api/v1/token/login/", userData)
        const { auth_token } = response.data;
        setAxiosAuthToken(auth_token);
        dispatch(setToken(auth_token));
        dispatch(getCurrentUser(redirectTo)); // ここでログイン成功時、リダイレクトさせたい。
        console.log('here', response.data)
    } catch (err) {
      console.log('here2', err)
      dispatch(unsetCurrentUser());
      toastOnError(err);
    }
}

// aaaaa@ggggggg.com (test account)
const Login = (props) => {
  const [error, setError] = useState(null);
  // console.log('props,', props)
  const onSubmit = async (values) => {
    const postedData = {
      username: values.userName,
      // email: values.email,
      password: values.password
    }
    setError(null);
    console.log("valuesForLogin", postedData)
    await props.login(values, "/dashboard") // このログイン関数が何も行ってくれない。（ここでリダイレクトさせたい。）
　
    const response = await axios.post("/api/v1/token/login/", postedData).catch((err) => {
      if (err && err.response) {
        setError(err.response.data.message);
      }
    }

    );
    if (response) {
      console.log("Auth success");
      console.log(response);
      const { auth_token } = response.data; // get auth_token
      props.history.push('/dashboard')
      console.log("pushed")
      // setAxiosAuthToken(auth_token);
    }


  }
  const formik = useFormik({initialValues: {userName: "", password: ""}, validateOnBlur: true, onSubmit, validationSchema: validationSchema });
  return (
    <BoxContainer>
      <h1>Login</h1>
      {error && <FormError>{error ? error: ""}</FormError>}
      <FormContainer onSubmit={formik.handleSubmit}>
        <FieldContainer>
        <Input name="userName" placeholder="Username" value={formik.values.userName} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
        {<FieldError>{formik.touched.userName && formik.errors.userName ? formik.errors.userName : ""}</FieldError>}
        </FieldContainer>


        <FieldContainer>
        <Input name="password" type="password" placeholder="Password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
        {<FieldError>{formik.touched.password && formik.errors.password ? formik.errors.password : ""}</FieldError>}

        </FieldContainer>
      <MutedLink href="#">Forget your password?</MutedLink>
      <SubmitButton type="submit"
                    disabled={!formik.isValid}
      >Signin</SubmitButton>
      </FormContainer>


    </BoxContainer>
  );
}


// connect action and store and component
Login.propTypes = {
  login: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  login
})(withRouter(Login));