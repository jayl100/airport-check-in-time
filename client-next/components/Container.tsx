interface Props {
  children?: React.ReactNode;
}

function Container({ children }: Props) {
  return (
    <div className="mx-auto my-10 px-4 text-center tablet:px-10 max-w-screen-desktop">
      {children}
    </div>
  );
}


export default Container;