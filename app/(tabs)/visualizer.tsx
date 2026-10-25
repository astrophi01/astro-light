import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { OrbitControls, Sphere, useTexture } from "@react-three/drei/native";
import { Canvas } from "@react-three/fiber/native";
import { CameraType, CameraView } from "expo-camera";
import { } from "expo-sensors";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  useAnimatedValue,
  View,
} from "react-native";
import * as THREE from "three";

const handleStorage = async (value: string) => {
  try {
    if (value == "Cluster") {
      const notFound = (await AsyncStorage.getItem("Cluster")) === null;
      if (notFound) {
        await AsyncStorage.setItem("Cluster", "sunny");
      }
    }
  } catch (error) {
    console.error("Couldn't save bortle badge", error);
  }
};

const Map = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  // const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const isFocused = useIsFocused();
  const [showCamera, setShowCamera] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const fadeAnimation = useAnimatedValue(0);

  // const [skyData, setSkyData] = useState<{
  //   uri: string;
  //   location: Location.LocationObject["coords"];
  //   timestamp: number;
  // } | null>(null);
  // const meshRef = useRef(null);

  // requestPermission();

  useEffect(() => {
    fadeAnimation.setValue(0);
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [showCamera, fadeAnimation, isFocused]);

  useEffect(() => {
    if (!isFocused) {
      setShowCamera(false);
      setShowVisualizer(false);
    }
  }, [isFocused]);
  /*
  useEffect(() => {
    if (!isFocused) return;

    let isMounted = true;

    let subscriber: Location.LocationSubscription | null = null;

    async function getLocation() {
      let { status } = await Location.getForegroundPermissionsAsync();
      console.log(status);
      if (status !== "granted") {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted")
          return setErrorMsg("Permission to access location denied");
      }

      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (liveLocation) => {
          if (isMounted) {
            setLocation(liveLocation);
          }
        },
      );
      if (!isMounted) {
        subscriber.remove();
      }
    }

    getLocation();

    return () => {
      isMounted = false;
      if (subscriber) {
        subscriber.remove();
      }
    };
  }, [isFocused]);

  async function takePicture() {
    if (!location) {
      console.log("Location not ready");
      return;
    }

    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setShowVisualizer(true);
      setSkyData({
        uri: photo.uri,
        location: location.coords,
        timestamp: location.timestamp,
      });
    }
  }
*/
  // useEffect(() => {
  //   console.log(skyData);
  // }, [skyData]);

  // function toggleFacing() {
  //   setFacing((current) => (current === "back" ? "front" : "back"));
  // }

  // if (!permission) {
  //   return <View style={styles.container}></View>;
  // }

  // if (!permission.granted) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.notGranted}>
  //         Camera permissions not granted. Camera access needed to use
  //         visualizer.
  //       </Text>
  //       <Button onPress={requestPermission} title="Grant Permission" />
  //     </View>
  //   );
  // }

  if (!showCamera) {
    return (
      <View style={styles.visualWelcome}>
        <Animated.View style={{ opacity: fadeAnimation }}>
          <Text style={styles.title}>Welcome to the Visualizer</Text>
          <View style={{ width: "90%" }}>
            <Text style={styles.description}>
              Experience the universe free from artificial light pollution and
              atmospheric interference
            </Text>
          </View>
          <Pressable
            onPress={() => {
              setShowCamera(true);
              setShowVisualizer(true);
            }}
          >
            <Text style={styles.Button}>Get Started</Text>
          </Pressable>
          <Text style={[styles.credit]}>
            Source for visualizer image: NASA/Goddard Space Flight Center
            Scientific Visualization Studio. Gaia DR2: ESA/Gaia/DPAC
          </Text>
        </Animated.View>
      </View>
    );
  }
  /*
  if (showCamera && !showVisualizer) {
    return (
      <View style={styles.container}>
        <CameraView ref={cameraRef} facing={facing} style={styles.camera} />
        <TouchableOpacity
          onPress={takePicture}
          disabled={!location}
          style={[styles.takePic, { opacity: location ? 1 : 0.5 }]}
        />
        <TouchableOpacity onPress={toggleFacing} style={styles.facing}>
          <Ionicons name="refresh" size={35} color="white" />
        </TouchableOpacity>
      </View>
    );
  }*/

  function Planetarium() {
    // Need to use downloadAsync here to avoid weird crashing or making user wait for exr file to download and parse
    // const asset = Asset.fromModule(require("../../assets/images/NASAexr.exr"));

    // const image = useLoader(EXRLoader, asset.localUri || asset.uri);

    const texture = useTexture(require("../../assets/images/NASApng2.png"));

    // console.log(
    //   "image",
    //   texture.width,
    //   texture.height,
    //   texture.format,
    //   texture.type,
    // );

    return (
      <>
        <Sphere args={[500, 64, 64]} position={[0, 0, 0]}>
          <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </Sphere>
        <mesh
          onClick={async (event: { stopPropagation: () => void }) => {
            event.stopPropagation();
            await handleStorage("Cluster");
            console.log("Pleiades Pressed");
          }}
        >
          <Sphere
            args={[40, 50, 50]}
            position={[195, 160, 300]}
            visible={false}
          >
            <meshBasicMaterial />
          </Sphere>
        </mesh>
      </>
    );
  }

  return (
    <View style={[{ flex: 1 }]}>
      <Canvas camera={{ position: [50, 2, 10], fov: 75 }}>
        <Suspense fallback={null}>
          <Planetarium />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  //Fix the absolute positioning
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  visualWelcome: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#0F172A",
  },

  description: {
    marginLeft: "5%",
    fontFamily: "SegoeUI",
    fontSize: 18,
    color: "#F8FAFC",
    lineHeight: 27,
    marginTop: "25%",
  },

  title: {
    fontSize: 50,
    fontFamily: "SegoeUI",
    marginLeft: "5%",
    marginTop: "55%",
    color: "#F8FAFC",
  },

  Button: {
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 20,
    backgroundColor: "#6bd0fc",
    fontFamily: "SegoeUI",
    fontWeight: "bold",
    fontSize: 20,
    width: "90%",
    borderRadius: 10,
    marginTop: "30%",
  },
  credit: {
    fontSize: 7.2,
    marginTop: "27.5%",
    textAlign: "center",
    fontFamily: "Segoe UI",
    color: "#94A3B8",
  },

  notGranted: {
    textAlign: "center",
  },
  // takePic: {
  //   width: 90,
  //   height: 90,
  //   borderRadius: 45,
  //   backgroundColor: "white",
  //   borderColor: "rgb(67, 67, 67)",
  //   borderWidth: 5,
  //   position: "absolute",
  //   marginTop: 670,
  // },
  // description: {
  //   marginTop: 20,
  //   marginBottom: 20,
  //   fontSize: 20,
  //   fontFamily: "SegoeUI",
  //   fontWeight: "bold",
  // },

  // facing: {
  //   position: "absolute",
  //   top: 740,
  //   left: 285,
  // },
  //  visualizerTitle: {
  //   fontSize: 50,
  //   fontFamily: "SegoeUI",
  //   fontWeight: "bold",
  //   textAlign: "center",
  //   padding: 20,
  //   backgroundColor: "lightblue",
  //   borderRadius: 20,
  //   marginTop: 60,
  //   width: "90%",
  // },
  // camera: {
  //   width: "100%",
  //   height: "100%",
  // },
});

export default Map;
