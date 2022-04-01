import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return <div className="">User has logged in {session}</div>;
}
