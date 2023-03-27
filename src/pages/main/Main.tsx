import React from 'react'
import styled, { css } from 'styled-components'
import { BLUE, IMAGEPATH, ORANGE, TURQUOISE } from '../../constants/valiables'
import { adaptiveSize } from '../../constants/helperFunctions';
import Carousel from '../../components/carousels/CarouselMain';
import { useAppSelector } from '../../store/hooks';
import { NavLink } from 'react-router-dom';

const Main = () => {

  const accessToken = useAppSelector(state => state.auth.accessToken)

  return (
    <>
      <MainArticle>
        <TextContainer>
          <Title>
            сервис по поиску<br />
            публикаций<br />
            о компании<br />
            по его ИНН
          </Title>
          <Text>
            Комплексный анализ публикаций, получение данных <br />
            в формате PDF на электронную почту.
          </Text>
          {accessToken && <ButtonRequest to="/search">
            Запросить данные
          </ButtonRequest>}
        </TextContainer>
        <Image></Image>
      </MainArticle>
      <Featured>
        <FeaturedTitle>Почему именно мы</FeaturedTitle>
        <Carousel />
      </Featured>
      <BGMainBottom />
      <TariffsContainer>
        <TariffTitle>наши тарифы</TariffTitle>
        <Tariffs>

          <TariffsSingle>
            <TariffsSingleTitle bgColor={ORANGE} textColor='#000'>
              <TariffsSingleTitleBig>
                Beginner
              </TariffsSingleTitleBig>
              <TariffsSingleTitleSmall>
                Для небольшого исследования
              </TariffsSingleTitleSmall>
            </TariffsSingleTitle>
            <TariffSingleDetails showBorder={accessToken.length ? true : false}>
              <TariffSinglePrice>
                <TariffSinglePriceCurrent>799 ₽</TariffSinglePriceCurrent>
                <TariffSinglePriceSalesLess>1 200 ₽</TariffSinglePriceSalesLess>
              </TariffSinglePrice>
              <TariffSinglePriceDetails>
                или 150 ₽/мес. при рассрочке на 24 мес.
              </TariffSinglePriceDetails>
              <TariffSingleContains>
                <span>В тариф входит:</span>
                <ul>
                  <li>Безлимитная история запросов</li>
                  <li>Безопасная сделка</li>
                  <li>Поддержка 24/7</li>
                </ul>
              </TariffSingleContains>
              <TariffSingleButton isActive={accessToken.length ? true : false}>
                {accessToken.length ? "Перейти в личный кабинет" : "Подробнее"}
              </TariffSingleButton>
            </TariffSingleDetails>
          </TariffsSingle>

          <TariffsSingle>
            <TariffsSingleTitle bgColor={TURQUOISE} textColor='#000'>
              <TariffsSingleTitleBig>
                Pro
              </TariffsSingleTitleBig>
              <TariffsSingleTitleSmall>
                Для HR и фрилансеров
              </TariffsSingleTitleSmall>
            </TariffsSingleTitle>
            <TariffSingleDetails showBorder={false}>
              <TariffSinglePrice>
                <TariffSinglePriceCurrent>1 299 ₽</TariffSinglePriceCurrent>
                <TariffSinglePriceSalesLess>2 600 ₽</TariffSinglePriceSalesLess>
              </TariffSinglePrice>
              <TariffSinglePriceDetails>
                или 279 ₽/мес. при рассрочке на 24 мес.
              </TariffSinglePriceDetails>
              <TariffSingleContains>
                <span>В тариф входит:</span>
                <ul>
                  <li>Все пункты тарифа Beginner</li>
                  <li>Экспорт истории</li>
                  <li>Рекомендации по приоритетам</li>
                </ul>
              </TariffSingleContains>
              <TariffSingleButton>
                Подробнее
              </TariffSingleButton>
            </TariffSingleDetails>
          </TariffsSingle>

          <TariffsSingle>
            <TariffsSingleTitle bgColor='#000' textColor='#fff'>
              <TariffsSingleTitleBig>
                Business
              </TariffsSingleTitleBig>
              <TariffsSingleTitleSmall>
                Для корпоративных клиентов
              </TariffsSingleTitleSmall>
            </TariffsSingleTitle>
            <TariffSingleDetails showBorder={false}>
              <TariffSinglePrice>
                <TariffSinglePriceCurrent>2 379 ₽</TariffSinglePriceCurrent>
                <TariffSinglePriceSalesLess>3 700 ₽</TariffSinglePriceSalesLess>
              </TariffSinglePrice>
              <TariffSinglePriceDetails>
                или 150 ₽/мес. при рассрочке на 24 мес.
              </TariffSinglePriceDetails>
              <TariffSingleContains>
                <span>В тариф входит:</span>
                <ul>
                  <li>Безлимитная история запросов</li>
                  <li>Безопасная сделка</li>
                  <li>Поддержка 24/7</li>
                </ul>
              </TariffSingleContains>
              <TariffSingleButton>
                Подробнее
              </TariffSingleButton>
            </TariffSingleDetails>
          </TariffsSingle>

        </Tariffs>
      </TariffsContainer>
    </>
  )
}

const TariffSingleContains = styled.div`
  margin-top: 59px;

  & span {
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.01em;
  }

  & ul {
    list-style: none;
    padding: 0;
    margin: 10px 0;
  }

  & ul > li {
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    letter-spacing: 0.01em;
    display: flex;
  }

  & ul > li::before {
    content: "";
    display: block;
    background-image: url(${IMAGEPATH + "confirm.svg"});
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`

const TariffSingleButton = styled.div<{ isActive?: boolean }>`
  width: 355px;
  height: 59px;
  background: ${p => p.isActive === true ? "#D2D2D2" : BLUE};
  color: ${p => p.isActive === true ? "#000" : "#fff"};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  line-height: 24px;
  margin-top: 50px;

  &:hover {
    cursor: pointer;
  }

  @media (max-width: 500px) {
    width: 286px;
    font-size: 18px;
    line-height: 22px;
  }
  
`

const TariffSinglePriceDetails = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.01em;
  margin-top: 10px;
`

const TariffSinglePrice = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const TariffSingleDetails = styled.div<{ showBorder: boolean }>`
  ${p => {
    if (p.showBorder === true) {
      return css`
        border: 2px solid ${ORANGE};
      `
    }
  }}
  border-top: none;
  border-radius: 0 0 10px 10px;
  padding: 30px 10px 24px 30px;
`

const TariffSinglePriceSalesLess = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 25px;
  line-height: 30px;
  letter-spacing: 0.01em;
  text-decoration-line: line-through;

  color: rgba(0,0,0,0.5);
`

const TariffSinglePriceCurrent = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 30px;
  line-height: 36px;
  letter-spacing: 0.01em;
  margin-right: 20px;
`

const TariffsSingleTitleSmall = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.01em;
  margin-top: 10px;
`

const TariffsSingleTitleBig = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 30px;
  line-height: 36px;
  letter-spacing: 0.01em;
`

const TariffsSingle = styled.div`
  box-shadow: 0px 0px 20px rgb(0 0 0 / 20%);
  border-radius: 10px 10px 10px 10px;
`

const TariffsSingleTitle = styled.div<{ bgColor: string, textColor: string }>`
  width: 100%;
  color: ${p => p.textColor};
  background-color: ${p => p.bgColor};
  background-image: url(${IMAGEPATH + "Lamp.svg"});
  border-radius: 10px 10px 0 0;
  background-repeat: no-repeat;
  background-position: top 10px right 10px;
  padding-top: 30px;
  padding-left: 30px;
  padding-bottom: 34px;
  box-sizing: border-box;
`

const Tariffs = styled.div`
  display: flex;
  flex-direction: row;
  gap: 37px;
  justify-content: center;
  flex-wrap: wrap;
`

const TariffTitle = styled.div`
  font-family: 'Ferry';
  font-style: normal;
  font-weight: 900;
  font-size: 45px;
  line-height: 54px;
  letter-spacing: 0.01em;
  margin-bottom: 70px;

  @media (max-width: 500px) {
    font-weight: 900;
    font-size: 28px;
    line-height: 34px;
  }

`

const TariffsContainer = styled.div`
  max-width: 1320px;
  margin: 0 auto 110px;
  
  @media (max-width: 500px) {
    margin-bottom: 40px;
  }
`

const BGMainBottom = styled.div`
  width: 1307px;
  height: 575.52px;
  background-image: url(${IMAGEPATH + "BGMainBottom.svg"});
  background-repeat: no-repeat;
  margin: 0 auto;
  margin-top: 70px;
  margin-bottom: 100px;

  /* ${adaptiveSize("height", 575, 252, 1440, 700)} */

  @media (max-width: 1440px) {
    margin-top: 75px;
    width: calc(100% - 100px);
    margin-left: 50px;
    margin-right: 50px;
    background-size: 100%;
    /* height: calc(252px + ${((575 - 252) + (575 - 252) * 0.7)} * ((100vw - 700px) / 1440)); */
    height: calc(252px + 323 * (100vw / 1440))
  }

  @media (max-width: 700px) {
    margin-top: 80px;
    width: calc(100% - 28px);
    margin-left: 14px;
    margin-right: 14px;
    background-size: 712px;
    height: 392px;
    /* height: calc(252px + ${((575 - 252) + (575 - 252) * 0.7)} * ((100vw - 700px) / 1440)); */
    /* height: calc(252px + 323 * (100vw / 1440)) */
  }
`

const Featured = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  margin-top: 139px;
  
  @media (max-width: 1000px) {
    margin-top: 75px;
  }

  @media (max-width: 750px) {
    margin-top: 50px;
  }
`

const FeaturedTitle = styled.div`
  font-family: 'Ferry';
  font-style: normal;
  font-weight: 900;
  font-size: 45px;
  line-height: 54px;
  letter-spacing: 0.01em;
  margin-bottom: 10px;

  @media (max-width: 750px) {
    font-size: 28px;
    line-height: 34px;
  }
`

const ButtonRequest = styled(NavLink)`
  width: 335px;
  height: 59px;
  background: ${BLUE};
  border-radius: 5px;
  margin-top: 70px;
  border: none;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  line-height: 27px;
  letter-spacing: 0.01em;
  color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  &:hover {
    cursor: pointer;
  }

  @media (max-width: 750px) {
    margin-top: 32px;
  }
`

const TextContainer = styled.div`
  
`

const Text = styled.div`
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.01em;
  margin-top: 25px;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.01em;

  @media (max-width: 750px) {
    max-width: 320px;
    font-size: 18px;

    & br {
      display: none;
    }
  }
`

const Title = styled.div`
  font-family: "Ferry";
  font-weight: 900;
  font-size: 60px;
  line-height: 72px;
  letter-spacing: 0.01em;
  margin-top: 4px;

  ${adaptiveSize("font-size", 60, 20)}

  ${adaptiveSize("line-height", 72, 34)}

  @media (max-width: 800px) {
    font-size: 28px;
    line-height: 34px;
  }
`

const Image = styled.div`
  margin-top: 0;
  margin-left: -12px;
  z-index: -1;
  width: 574px;
  height: 584px;
  background-image: url(./images/MainBG.png);
  background-repeat: no-repeat;
  background-size: 100%;

  ${adaptiveSize("width", 574, 316)}

  @media (max-width: 750px) {
    width: 316px;
    height: 327px;
    margin-top: 40px;
    margin-left: 0;
    z-index: 0;
  }
`

const MainArticle = styled.div`
  display: flex;
  margin: 0 auto;
  max-width: 1320px;
  margin-top: 40px;

  @media (max-width: 750px) {
    flex-direction: column;
    align-items: center;
    margin-top: 0;
  }
`

export default Main