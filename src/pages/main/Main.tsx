import React, { useEffect } from 'react'
import Carousel from '../../components/carousels/CarouselMain';
import { ORANGE, TURQUOISE } from '../../constants/valiables';
import { useAppSelector } from '../../store/hooks';
import { MainArticle, Text, Image, TextContainer, Title, ButtonRequest, Featured, FeaturedTitle, BGMainBottom, TariffsContainer, TariffTitle, Tariffs, TariffsSingle, TariffsSingleTitle, TariffsSingleTitleBig, TariffsSingleTitleSmall, TariffSingleDetails, TariffSinglePrice, TariffSinglePriceCurrent, TariffSinglePriceSalesLess, TariffSinglePriceDetails, TariffSingleContains, TariffSingleButton } from './Main.Styped';

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

export default Main