import { Sphere as ThreeSphere } from "@react-three/drei/native";

//Planetarium renderer
export function Sphere() {
  console.log("called 1.");
  // const texture = useLoader(TextureLoader, "../../assets/images/starmap.jpg");
  // console.log(texture);
  return (
    <ThreeSphere args={[1, 64, 64]}>
      <meshStandardMaterial
        color="lightblue"
        roughness={0.3}
        // map={texture}
      />
    </ThreeSphere>
  );
}
