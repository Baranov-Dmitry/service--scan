
import { NavLink } from "react-router-dom"
import styled, { css } from "styled-components"
import { adaptiveSize } from "../../constants/helperFunctions"
import { BLUE, IMAGEPATH, ORANGE } from "../../constants/valiables"

export const TariffSingleContains = styled.div`
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

export const TariffSingleButton = styled.div<{ isActive?: boolean }>`
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

export const TariffSinglePriceDetails = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.01em;
  margin-top: 10px;
`

export const TariffSinglePrice = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const TariffSingleDetails = styled.div<{ showBorder: boolean }>`
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

export const TariffSinglePriceSalesLess = styled.div`
  font-weight: 500;
  font-size: 25px;
  line-height: 30px;
  letter-spacing: 0.01em;
  text-decoration-line: line-through;
  color: rgba(0,0,0,0.5);
`

export const TariffSinglePriceCurrent = styled.div`
  font-weight: 500;
  font-size: 30px;
  line-height: 36px;
  letter-spacing: 0.01em;
  margin-right: 20px;
`

export const TariffsSingleTitleSmall = styled.div`
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.01em;
  margin-top: 10px;
`

export const TariffsSingleTitleBig = styled.div`
  font-weight: 500;
  font-size: 30px;
  line-height: 36px;
  letter-spacing: 0.01em;
`

export const TariffsSingle = styled.div`
  box-shadow: 0px 0px 20px rgb(0 0 0 / 20%);
  border-radius: 10px 10px 10px 10px;
`

export const TariffsSingleTitle = styled.div<{ bgColor: string, textColor: string }>`
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

export const Tariffs = styled.div`
  display: flex;
  flex-direction: row;
  gap: 37px;
  justify-content: center;
  flex-wrap: wrap;
`

export const TariffTitle = styled.div`
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

export const TariffsContainer = styled.div`
  max-width: 1320px;
  margin: 0 auto 110px;
  
  @media (max-width: 500px) {
    margin-bottom: 40px;
  }
`

export const BGMainBottom = styled.div`
  width: 1307px;
  height: 575.52px;
  background-image: url(${IMAGEPATH + "BGMainBottom.svg"});
  background-repeat: no-repeat;
  margin: 0 auto;
  margin-top: 70px;
  margin-bottom: 100px;

  @media (max-width: 1440px) {
    margin-top: 75px;
    width: calc(100% - 100px);
    margin-left: 50px;
    margin-right: 50px;
    background-size: 100%;
    height: calc(252px + 323 * (100vw / 1440))
  }

  @media (max-width: 700px) {
    margin-top: 80px;
    width: calc(100% - 28px);
    margin-left: 14px;
    margin-right: 14px;
    background-size: 712px;
    height: 392px;
  }
`

export const Featured = styled.div`
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

export const FeaturedTitle = styled.div`
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

export const ButtonRequest = styled(NavLink)`
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

export const TextContainer = styled.div`
  
`

export const Text = styled.div`
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

export const Title = styled.div`
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

export const Image = styled.div`
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

export const MainArticle = styled.div`
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