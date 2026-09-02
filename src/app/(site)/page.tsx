import Link from "next/link";

const HomePage = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-5xl font-mono font-bold default-text">Flash Fingers</h1>
      <p className="default-text opacity-60 text-lg">
        A minimalist typing game. How fast are your fingers?
      </p>
      <Link
        href="/play"
        className="mt-4 px-8 py-3 rounded-lg font-mono text-lg correct-text border border-current hover:opacity-70 transition-opacity"
      >
        Play
      </Link>
    </div>
  );
};

export default HomePage;
