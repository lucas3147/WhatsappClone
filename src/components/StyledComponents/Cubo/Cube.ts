import styled, { css } from "styled-components";

const container = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100svh;
  width: 100svw;
  perspective: 1000px; 
`;

const scene = css`
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(0deg) rotateY(0deg);
  transition: transform 0.5s ease-out;
`;

const face = css`
  position: absolute;
  height: 100%;
  width: 100%;
`;

const front = css` transform: rotateY(0deg) translateZ(200px); `;
const back   = css` transform: rotateY(180deg) translateZ(200px); `;
const right  = css` transform: rotateY(90deg)  translateZ(200px); `;
const left   = css` transform: rotateY(-90deg) translateZ(200px); `;
const top    = css` transform: rotateX(90deg)  translateZ(200px); `;
const bottom = css` transform: rotateX(-90deg) translateZ(200px); `;

export const CubeContainer = styled.div`
    ${container}
`;

export const CubeScene = styled.div`
    ${scene}
`;

export const CubeFaceFront = styled.div`
    ${face}
    ${front}
`;

export const CubeFaceBack = styled.div`
    ${face}
    ${back}
`;

export const CubeFaceRight = styled.div`
    ${face}
    ${right}
`;

export const CubeFaceLeft = styled.div`
    ${face}
    ${left}
`;

export const CubeFaceTop = styled.div`
    ${face}
    ${top}
`;

export const CubeFaceBottom = styled.div`
    ${face}
    ${bottom}
`;