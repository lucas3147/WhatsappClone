import styled, { css } from "styled-components";

export type SideType = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';

interface CubeSceneProps {
  side: SideType;
}

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

export const CubeContainer = styled.div`
    ${container}
`;

export const CubeScene = styled.div<CubeSceneProps>`
    ${scene}
    transform: ${(props) => {
        switch (props.side) {
            case 'front':
              return 'rotateX(0deg) rotateY(0deg)';
            case 'back':
              return 'rotateX(0deg) rotateY(180deg)';
            case 'left':
              return 'rotateX(0deg) rotateY(90deg)';
            case 'right':
              return 'rotateX(0deg) rotateY(-90deg) ';
            case 'top':
              return 'rotateX(-90deg) rotateY(0deg)';
            case 'bottom':
              return 'rotateX(90deg) rotateY(0deg) ';
            default:
              return 'rotateX(0deg) rotateY(0deg)';
    }}}
`;

export const CubeFaceFront = styled.div`
    ${face}
    transform: rotateY(0deg) translateZ(140px);
    @media (min-width: 640px) {
        transform: rotateY(0deg) translateZ(200px);
    }
`;

export const CubeFaceBack = styled.div`
    ${face}
    transform: rotateY(180deg) translateZ(140px);
    @media (min-width: 640px) {
        transform: rotateY(180deg) translateZ(200px);
    }
`;

export const CubeFaceRight = styled.div`
    ${face}
    transform: rotateY(90deg) translateZ(140px);
    @media (min-width: 640px) {
        transform: rotateY(90deg) translateZ(200px);
    }
`;

export const CubeFaceLeft = styled.div`
    ${face}
    transform: rotateY(-90deg) translateZ(140px);
    @media (min-width: 640px) {
        transform: rotateY(-90deg) translateZ(200px);
    }
`;

export const CubeFaceTop = styled.div`
    ${face}
    transform: rotateY(90deg) translateZ(140px);
    @media (min-width: 640px) {
        transform: rotateY(90deg) translateZ(200px);
    }
`;

export const CubeFaceBottom = styled.div`
    ${face}
    transform: rotateY(-90deg) translateZ(140px);
    @media (min-width: 640px) {
        transform: rotateY(-90deg) translateZ(200px);
    }
`;

