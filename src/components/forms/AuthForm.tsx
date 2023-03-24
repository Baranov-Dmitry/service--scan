import React, { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getFiltersInfoAsync, setToken, AccessData } from '../../redusers/authSlice';
import { checkPhone } from '../../constants/helperFunctions';
import { IMAGEPATH } from '../../constants/valiables';
import styled, { css } from 'styled-components';
import { useAppDispatch } from '../../store/hooks';

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
        dispatch(setToken({ ...token }))
        dispatch(getFiltersInfoAsync(token.accessToken))
        navigate("/search")
      } else {

        throw new Error("Failed to login");

      }

    } catch (error) {
      console.log("error", error)
      setAuthData(prev => ({ ...prev, password: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit}>

      <Label htmlFor={inputID + "login"}>Логин или номер телефона:</Label>
      <Input
        id={inputID + "login"}
        value={authData.login ?? ""}
        onChange={e => setAuthData(prev => ({ ...prev, login: e.target.value }))}
        type="text"
        marginBottomZero={loginErr}
      />

      {loginErr && <ErrorInput>Введите корректные данные</ErrorInput>}

      <Label htmlFor={inputID + "password"}>Пароль:</Label>
      <Input
        id={inputID + "password"}
        value={authData.password ?? ""}
        onChange={e => setAuthData(prev => ({ ...prev, password: e.target.value }))}
        type="text"
        marginBottomZero={passwordErr}
      />

      {passwordErr && <ErrorInput>Неправильный пароль</ErrorInput>}
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

const Input = styled.input<{ marginBottomZero: boolean }>`
  width: 100%;
  height: 43px;
  border: 1px solid #C7C7C7;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  padding: 0 10px;
  margin: 15px 0 20px;
  box-sizing: border-box;
  font-size: 20px;
  ${p => p.marginBottomZero === true ? css`
    margin-bottom: 0;
    color: red;
    border-color: red;
  ` : null}
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