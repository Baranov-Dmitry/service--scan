import React, { useMemo } from 'react'
import { Carousel as SlickCarousel } from 'antd';
import styled from 'styled-components';
import type { Settings, CustomArrowProps } from '@ant-design/react-slick';
import { IMAGEPATH } from '../../constants/valiables';

const Carousel = () => {

  const settings: Settings = useMemo(() => ({
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    // adaptiveHeight: true,
    prevArrow: <SampleSlickArrow style={{ width: "39px", height: "39px", transform: "translate(0, -50%)" }}><ArrowLeft /></SampleSlickArrow>,
    nextArrow: <SampleSlickArrow style={{ width: "39px", height: "39px", transform: "translate(0, -50%)" }}><ArrowRight /></SampleSlickArrow>,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  }), [])

  return (
    <SlickCarousel {...settings}>
      <Slide>
        <SlideContent>
          <img src="./images/FeacureClock.svg" alt="" />
          <h3>Высокая и оперативная скорость обработки заявки</h3>
        </SlideContent>
      </Slide>
      <Slide>
        <SlideContent>
          <img src="./images/FeaturedSearch.svg" alt="" />
          <h3>Огромная комплексная база данных, обеспечивающая объективный ответ на запрос</h3>
        </SlideContent>
      </Slide>
      <Slide>
        <SlideContent>
          <img src="./images/FeaturedDef.svg" alt="" />
          <h3>Высокая и оперативная скорость обработки заявки</h3>
        </SlideContent>
      </Slide>
      <Slide>
        <SlideContent>
          <img src="./images/FeacureClock.svg" alt="" />
          <h3>Высокая и оперативная скорость обработки заявки</h3>
        </SlideContent>
      </Slide>
      <Slide>
        <SlideContent>
          <img src="./images/FeaturedSearch.svg" alt="" />
          <h3>Огромная комплексная база данных, обеспечивающая объективный ответ на запрос</h3>
        </SlideContent>
      </Slide>
      <Slide>
        <SlideContent>
          <img src="./images/FeaturedDef.svg" alt="" />
          <h3>Высокая и оперативная скорость обработки заявки</h3>
        </SlideContent>
      </Slide>
    </SlickCarousel>
  )
}

interface CustomArrowPropsWithChildren extends CustomArrowProps {
  children: JSX.Element
}

const SampleSlickArrow = (props: CustomArrowPropsWithChildren) => {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      onClick={onClick}
      style={{ ...style, width: "39px", height: "39px" }}
    >
      {props.children}
    </div>
  )
}

const Slide = styled.div`
  
`

const SlideContent = styled.div`
  margin: 20px 15px;
  padding: 22px 20px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  min-height: 225px;
  box-sizing: border-box;
`

const ArrowLeft = styled.div`
  width: 39px;
  height: 39px;
  background-image: url(${IMAGEPATH + "arrow.svg"});
`

const ArrowRight = styled(ArrowLeft)`
  transform: rotate(180deg);
`

export default Carousel