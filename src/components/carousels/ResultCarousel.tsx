import React from 'react'
import { Carousel } from 'antd'
import styled from 'styled-components'
import { ArrowLeft, ArrowRight, SampleSlickArrow } from './CarouselMain'
import { AnalyticsHistogramData } from '../../models/Histogram'

interface Props {
  histogram: AnalyticsHistogramData[]
}

const ResultCarousel: React.FC<Props> = ({ histogram }) => {

  const options = {
    infinite: false,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <SampleSlickArrow costumnStyle={{
      left: "-170px",
      top: "45%",
      width: "39px",
      height: "39px",
    }}><ArrowLeft /></SampleSlickArrow>,
    nextArrow: <SampleSlickArrow costumnStyle={{
      left: "calc(100% + 8px)",
      top: "45%",
      width: "39px",
      height: "39px",
    }}><ArrowRight /></SampleSlickArrow>,
    useCSS: true,
    // adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          prevArrow: <SampleSlickArrow costumnStyle={{
            left: "-40px",
            top: "45%",
            width: "39px",
            height: "39px",
          }}><ArrowLeft /></SampleSlickArrow>,
          nextArrow: <SampleSlickArrow costumnStyle={{
            left: "100%",
            top: "40%",
            width: "39px",
            height: "39px",
          }}><ArrowRight /></SampleSlickArrow>,
        }
      }
    ]
  }

  return (
    <Carousel {...options}>
      {histogram[0].data.map((dataFild, index) => {
        const date = new Date(dataFild.date).toLocaleDateString("en-US")
        // date.replaceAll("/", ".")
        return (<div key={dataFild.date}><ResultCaruselItem>
          <span>{date.replaceAll("/", ".")}</span>
          <span>{dataFild.value}</span>
          <span>{histogram[1].data[index].value}</span>
        </ResultCaruselItem></div>)
      })}
    </Carousel>
  )
}

const ResultCaruselItem = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  position: relative;
  margin-right: 5px;

  span {
    padding: 17px 22px 12px 16px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    letter-spacing: 0.02em;
    color: #000000;
  }

  span:last-child {
    padding: 11px 22px 19px 16px;
  }

  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 15px;
    right: 0;
    width: 2px;
    height: calc(100% - 30px);
    background-color: rgba(148, 148, 148, 0.4);
  }

  @media (max-width: 500px) {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 75px;

    span:last-child {
      padding: 17px 22px 12px 16px;
    }
  }
`

export default ResultCarousel