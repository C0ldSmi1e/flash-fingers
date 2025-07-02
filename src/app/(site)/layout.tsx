const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex flex-col justify-center items-center min-h-screen">
      <div className="w-full max-w-7xl h-full grow pb-5 flex flex-col items-center">
        {children}
      </div>
    </div>
  );
};

export default Layout;