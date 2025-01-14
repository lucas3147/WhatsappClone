import styled, { css } from "styled-components";

const baseSliderStyle = css`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  transition: all 0.5s;
  display: flex;
  flex-direction: column;
`;

export const SliderLeftContainer = styled.div`
  ${baseSliderStyle};
  border-right: 1px solid #DDD;
  background-color: white;
  left: 0;
  overflow-y: auto;

  &.openFlap {
    z-index: 10;
    transform: translateX(0);
  }

  &.closeFlap {
    transform: translateX(-100%);
    z-index: -1;
  }

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 25%;
  }
`;

export const SliderRightContainer = styled.div`
  ${baseSliderStyle};
  right: 0;
  background-color: #F6F6F6;
  user-select: none;

  &.openFlap {
    z-index: 10;
    transform: translateX(0);
  }

  &.closeFlap {
    transform: translateX(100%);
    z-index: -1;
  }
`;
