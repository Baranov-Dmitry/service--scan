import { Row } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IMAGEPATH } from '../../constants/valiables';
import { ScanDoc } from '../../models/Histogram';

const ResultItem = ({ typedPost }: { typedPost: ScanDoc }) => {

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(typedPost.ok.content.markup, "text/xml").documentElement.textContent ?? '';

  return (
    <ResultItemSt>
      <ResultItemDetails>
        <span>{new Date(typedPost.ok.issueDate).toLocaleDateString()}</span>
        <span>{typedPost.ok.source.name}</span>
      </ResultItemDetails>
      <ResultItemTitle>{typedPost.ok.title.text}</ResultItemTitle>
      <ResultItemTitleButton>
        {
          typedPost.ok.attributes.isAnnouncement ? "Сводки новостей" : ""
            + typedPost.ok.attributes.isDigest ? "Анонс или календарь событий" : ""
              + typedPost.ok.attributes.isTechNews ? "Технические новости" : ""
        }
      </ResultItemTitleButton>
      <ResultItemImage image="11.png" />
      <ResultItemText dangerouslySetInnerHTML={{ __html: xmlDoc }}></ResultItemText>
      <Row justify="space-between" align="bottom" style={{ marginTop: "30px" }}>
        <ResultItemButton to={typedPost.ok.url} target="_blank">Читать в источнике</ResultItemButton>
        <WordCount>{typedPost.ok.attributes.wordCount} слова</WordCount>
      </Row>
    </ResultItemSt>
  )
}

const WordCount = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.02em;

  color: #949494;
`

const ResultItemButton = styled(Link)`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.02em;
  color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;

  width: 223px;
  height: 46px;
  background: #7CE3E1;
  border-radius: 5px;

  border: none;
  
  @media (max-width: 850px) {
    width: 195px;
    height: 40px;
  }

  &:hover {
    cursor: pointer;
  }
`

const ResultItemImage = styled.div<{ image: string }>`
  width: 100%;
  height: 158px;
  background: url(${p => IMAGEPATH + p.image});
  border-radius: 10px;
  background-size: 100%;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    width: 297px;
    height: 86px;
    background-repeat: no-repeat;
    background-size: 100%;
    align-self: center;
  }
`

const ResultItemText = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.02em;
  word-break: break-all;

  & img {
    max-width: 100%;
  }

  color: rgba(0,0,0,0.5);

  & p {
    margin: 20px 0;
  }
  
  @media (max-width: 600px) {

  }
`

const ResultItemTitleButton = styled.div`
  padding: 0 14px;
  height: 22px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 0.02em;
  color: #000000;
  background: #FFB64F;
  border-radius: 5px;
  align-self: flex-start;
  margin: 14px 0;
  display: flex;
  align-items: center;
`

const ResultItemTitle = styled.h4`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 26px;
  line-height: 31px;
  letter-spacing: 0.02em;
  color: #000000;
  margin: 14px 0 0 0;
  word-break: break-all;
`

const ResultItemDetails = styled.div`
  display: flex;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.02em;
  text-decoration-line: underline;
  color: #949494;

  & span:first-child {
    margin-right: 10px;
  }

  & span:nth-child(2) {
    word-break: break-all;
  }
`

const ResultItemSt = styled.div`
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 20px 30px 30px 30px;
  width: calc(50% - 15px);
  box-sizing: border-box;
  overflow: hidden;
  align-self: flex-start;

  @media (max-width: 900px) {
    width: 100%;
    padding: 19px 24px 24px 24px;
  }
  
`

export default React.memo(ResultItem)