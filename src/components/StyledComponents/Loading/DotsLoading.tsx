import { CSSProperties } from "react";
import styled, { keyframes } from "styled-components";

const jump = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-bottom: 12px;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  background-color: #3498db;
  border-radius: 50%;
  animation: ${jump} 1.5s infinite;

  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 0.3s;
  }
  &:nth-child(3) {
    animation-delay: 0.6s;
  }
`;

const DotsLoading = ({style, className, onClick, message}:{style?: CSSProperties, className?: string, onClick?: () => void, message?: string}) => {
    return (
      <div className="flex flex-col">
        <DotsContainer onClick={onClick}>
          <Dot style={style} className={className} />
          <Dot style={style} className={className} />
          <Dot style={style} className={className} />
        </DotsContainer>
        {message &&
          <p 
            style={{
              color: style?.backgroundColor,
              fontSize: '12px'
            }}
          >
            {message}
          </p>
        }
      </div>
    )
}

export default DotsLoading;