import React, { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getFiltersInfoAsync, setToken } from '../../../redusers/authSlice';
import { checkPhone } from '../../../constants/helperFunctions';
import { IMAGEPATH } from '../../../constants/valiables';
import styled, { css } from 'styled-components';
import { useAppDispatch } from '../../../store/hooks';
import { Input } from 'antd';
import { AccessData } from '../../../models/User';

const AuthForm = () => {

  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const inputID = useId()

  const [authData, setAuthData] = useState<{ login: string | null, password: string | null }>({ login: null, password: null })

  const loginErr = authData.login !== null
    && ((authData.login[0] === "+" && !checkPhone(authData.login)) || (authData.login[0] !== "+" && authData.login.length < 6)) ? true : false
  const passwordErr = authData.password !== null && (authData.password.length >= 0 && authData.password.length <= 6) ? true : false
  const isActiveButtom = passwordErr === false && loginErr === false && authData.login !== null && authData.password !== null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isActiveButtom) return

    const url = "https://gateway.scan-interfax.ru/api/v1/account/login"

    try {
      const response = await fetch(url, {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(authData)
      })

      if (response.ok) {
        const token = await response.json() as AccessData
        navigate("/")
        dispatch(setToken({ ...token }))
        dispatch(getFiltersInfoAsync(token.accessToken))
      } else {

        throw new Error("Failed to login");

      }

    } catch (error) {
      console.log("error", error)
      setAuthData(prev => ({ login: "", password: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit}>

      <InputContainer marginbottomzero={loginErr ? 1 : 0}>

        <Label htmlFor={inputID + "login"}>Логин или номер телефона:</Label>

        <InputSt
          id={inputID + "login"}
          value={authData.login ?? ""}
          onChange={e => setAuthData(prev => ({ ...prev, login: e.target.value }))}
          type="text"
        />

        {loginErr && <ErrorInput>Введите корректные данные</ErrorInput>}

      </InputContainer>


      <InputContainer marginbottomzero={passwordErr ? 1 : 0}>

        <Label htmlFor={inputID + "password"}>Пароль:</Label>

        <InputPassword
          id={inputID + "password"}
          value={authData.password ?? ""}
          onChange={e => setAuthData(prev => ({ ...prev, password: e.target.value }))}
          type="text"
        />

        {passwordErr && <ErrorInput>Неправильный пароль</ErrorInput>}

      </InputContainer>

      <ButSubmit disabled={!isActiveButtom} type='submit'>Войти</ButSubmit>

      <PasswordReset>Восстановить пароль</PasswordReset>

      <LogInServicesTitle>Войти через:</LogInServicesTitle>

      <LogInServices>
        <span></span>
        <span></span>
        <span></span>
      </LogInServices>
    </form>
  )
}

const LogInServicesTitle = styled.div`
  margin: 15px 0;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.02em;
  color: #949494;

`

const PasswordReset = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.02em;
  text-decoration-line: underline;
  color: #5970FF;
  text-align: center;
  margin: 15px 0 30px;
`

const ButSubmit = styled.button`
  width: 100%;
  height: 59px;
  background: #5970FF;
  border-radius: 5px;
  border: none;
  font-size: 22px;
  line-height: 27px;
  letter-spacing: 0.02em;
  color: #FFFFFF;

  &:disabled,
  &[disabled]{
    background: rgba(89, 112, 255, 0.5);
  }
`

const LogInServices = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 -10px;

  & span {
    width: 91px;
    height: 31px;
    background-repeat: no-repeat;
    background-position: center;
    border: 1px solid rgba(89, 112, 255, 0.51);
    margin: 0 10px;
  }

  & span:nth-child(1) {
    background-image: url(${IMAGEPATH + "Google.svg"});
  }

  & span:nth-child(2) {
    background-image: url(${IMAGEPATH + "facebook.svg"});
  }

  & span:nth-child(3) {
    background-image: url(${IMAGEPATH + "Yandex.svg"});
  }
`

const InputSt = styled(Input)`
  width: 100%;
  height: 43px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
  padding: 0 10px;
  box-sizing: border-box;
  font-size: 20px;
  
`

const InputContainer = styled.div <{ marginbottomzero: number }>`
  margin: 15px 0 20px;
  ${p => p.marginbottomzero === 1 ? css`
    margin-bottom: 0;
    color: red;
    border-color: red;
  ` : null}
`

const InputPassword = styled(Input.Password)`
  width: 100%;
  height: 43px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
  padding: 0 10px;
  
  box-sizing: border-box;
  font-size: 20px;
  
`

const Label = styled.label`
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.02em;
  color: #949494;
`

const ErrorInput = styled.div`
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.01em;
  color: #FF5959;
  margin: 1.5px 0;
  text-align: center;
`

export default AuthForm