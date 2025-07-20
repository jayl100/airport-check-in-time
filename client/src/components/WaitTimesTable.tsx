import React from 'react';
import formatSeconds from '../util/formatter';
import { IAirportCheckInTime } from '../lib/models';
import styled from 'styled-components';

interface Props {
  data: IAirportCheckInTime[];
}

export default function WaitTimesTable({ data }: Props) {
  return (
    <TableStyle>
      <thead>
      <TheadTrStyled>
        <ThStyled>공항</ThStyled>
        <ThStyled>처리 시각</ThStyled>
        <ThStyled>전체 평균</ThStyled>
        <ThStyled>Gate A</ThStyled>
        <ThStyled>Gate B</ThStyled>
        <ThStyled>Gate C</ThStyled>
        <ThStyled>Gate D</ThStyled>
      </TheadTrStyled>
      </thead>
      <tbody>
      {data.map((item, i) => (
        <TrStyled key={i}>
          <TdStyled>{item.airport_code}</TdStyled>
          <TdStyled>{item.processed_at}</TdStyled>
          <TdStyled>{formatSeconds(item.wait_all)}</TdStyled>
          <TdStyled>{formatSeconds(item.wait_a)}</TdStyled>
          <TdStyled>{formatSeconds(item.wait_b)}</TdStyled>
          <TdStyled>{formatSeconds(item.wait_c)}</TdStyled>
          <TdStyled>{formatSeconds(item.wait_d)}</TdStyled>
        </TrStyled>
      ))}
      </tbody>
    </TableStyle>
  );
}

const TableStyle = styled.table`
    margin: 0 auto;
    border-collapse: collapse;
    width: 100%;
    overflow: hidden;
`;

const TheadTrStyled = styled.tr`
    background-color: #93FFDC;
`
const TrStyled = styled.tr`
    &:hover {
        background-color: #f9f9f9;
    }
`;

const ThStyled = styled.th`
    padding: 16px 22px;
    border-bottom: 1px solid #d9d9d9;
    font-size: 1rem;
`;

const TdStyled = styled.td`
    padding: 16px 22px;
    border-bottom: 1px solid #d9d9d9;
    font-size: 1rem;
    text-align: center;
    
    &:nth-child(2) {
        background-color: #f9f9f9;
    }
`;