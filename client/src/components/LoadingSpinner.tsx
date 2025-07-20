import styled from 'styled-components';

interface Props {
  className?: string;
}

function LoadingSpinner({ className }: Props) {
  return (
    <LoadingSpinnerStyled className={className}>
      <div>Loading</div>
    </LoadingSpinnerStyled>
  );
}

const LoadingSpinnerStyled = styled.div`

`;

export default LoadingSpinner;