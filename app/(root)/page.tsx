import { auth } from "@/auth";

const Home = async () => {
  const session = await auth();
  console.log(session);
  return (
    <>
      <h1 className="h1-bold text-primary-500">
        Hello world i hope this is working
      </h1>
      <h1 className="h1-bold font-space-grotesk text-primary-500">
        Hello world i hope this is working
      </h1>
    </>
  );
};

export default Home;
