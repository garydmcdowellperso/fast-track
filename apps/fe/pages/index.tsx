import Home from "../components/Home";
import Frame from "../components/Frame";

export default function HomePage() {
  return <Frame child={<Home />} />;
}
