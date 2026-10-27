import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { OrbitControls, Sphere, useTexture } from "@react-three/drei/native";
import { Canvas } from "@react-three/fiber/native";
import { CameraType, CameraView } from "expo-camera";
import {} from "expo-sensors";
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
  const cameraRef = useRef<CameraView>(null);
  const isFocused = useIsFocused();
  const [showCamera, setShowCamera] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const fadeAnimation = useAnimatedValue(0);

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

  function Planetarium() {
    // If want to load exr image:
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
});

export default Map;
