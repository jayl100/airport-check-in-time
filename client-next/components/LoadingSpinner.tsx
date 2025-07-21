interface Props {
  className?: string;
}

function LoadingSpinner({ className }: Props) {
  return (
    <div className={className}>
      <div>Loading</div>
    </div>
  );
}

export default LoadingSpinner;