import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Body, Illumination } from "astronomy-engine";
import * as Location from "expo-location";
import React, {
  ComponentProps,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useAnimatedValue,
  View,
} from "react-native";

const LLM_CHAT_URL = process.env.EXPO_PUBLIC_LLM_API_URL;

const handleStorage = async (value: string) => {
  try {
    if (value == "Environment") {
      const notFound = (await AsyncStorage.getItem("Environment")) === null;
      if (notFound) {
        await AsyncStorage.setItem("Environment", "earth");
      }
    }
    if (value == "Sky") {
      const notFound = (await AsyncStorage.getItem("Sky")) === null;
      if (notFound) {
        await AsyncStorage.setItem("Sky", "search");
      }
    }
  } catch (error) {
    console.error("Couldn't save bortle badge", error);
  }
};

const Dashboard = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  //Conditions Variables
  const [temperature, setTemperature] = useState<number | undefined>(undefined);
  const [transparency, setTransparency] = useState<number | undefined>(
    undefined,
  );
  const [seeing, setSeeing] = useState<number | undefined>(undefined);
  const [cloudCover, setcloudCover] = useState<number | undefined>(undefined);
  const [cloudCoverLow, setcloudCoverLow] = useState<number | undefined>(
    undefined,
  );
  const [cloudCoverMid, setcloudCoverMid] = useState<number | undefined>(
    undefined,
  );
  const [cloudCoverHigh, setcloudCoverHigh] = useState<number | undefined>(
    undefined,
  );
  const [dewPointTemp, setdewPointTemp] = useState<number | undefined>(
    undefined,
  );
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [isDay, setIsDay] = useState<number | undefined>();
  const [moonPhase, setMoonPhase] = useState<number | undefined>(undefined);
  const isFocused = useIsFocused();
  const [badges, setBadges] = useState<(string | null)[]>([]);
  const [isEarned, setIsEarned] = useState<boolean>();
  const navigation = useNavigation();
  const fadeAnimation = useAnimatedValue(0);
  const fadeAnimation2 = useAnimatedValue(0.1);
  const [readyToProceed, setReadyToProceed] = useState(false);

  const [prompt, setPrompt] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>();

  let dataCloudCoverHigh;
  let dataCloudCoverMid;
  let dataCloudCoverLow;
  let dataTempDewDiff;
  let dataTemp;
  let dataTransparency;
  let dataSeeing;
  let [Moon, setMoon] = useState<string | undefined>(undefined);
  let AstronomyScore = 0;
  let dataMoonNorm = 0;
  let illum = 0;

  useEffect(() => {
    async function earned() {
      if (isFocused) {
        const check = await AsyncStorage.getItem("Environment");
        const earnedBadge = check !== null;
        if (earnedBadge) {
          setIsEarned(true);
        }
        setIsEarned(earnedBadge);
      }
    }
    earned();
  }, []);

  const transparencyArray = [
    ["Excellent", "<0.3 mag/AM"],
    ["Very Good", "0.3 - 0.4 mag/AM"],
    ["Good", "0.4 - 0.5 mag/AM"],
    ["Fair", "0.5 - 0.6 mag/AM"],
    ["Below average", "0.6 - 0.7 mag/AM"],
    ["Poor", "0.7 - 0.85 mag/AM"],
    ["Very Poor", "0.85 - 1 mag/AM"],
    ["Terrible", ">1 mag/AM"],
    ["-", " "],
  ];

  const seeingArray = [
    ["Excellent", "<0.5 arcsec"],
    ["Very Good", "0.5 - 0.75 arcsec"],
    ["Good", "0.75 - 1 arcsec"],
    ["Fair", "1 - 1.25 arcsec"],
    ["Below average", "1.25 - 1.5 arcsec"],
    ["Poor", "1.5 - 2 arcsec"],
    ["Very Poor", "2 - 2.5 arcsec"],
    ["Terrible", ">2.5 arcsec"],
    ["-", " "],
  ];

  const fadeIn = () => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fadeIn();
  }, []);

  // Asks for permission to access user location and then gets current location. If permission denied, sends error message to user.
  useEffect(() => {
    async function getLocation() {
      //CHECK IF PERMISSION IS ALREADY GRANTED BEFORE ASKING FOR PERMISSION AGAIN
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location denied");
        return;
      }

      //Optimizes fetching speed by using last known location if available, otherwise gets current location.
      let location = await Location.getLastKnownPositionAsync({});

      if (location == null) {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });
      }

      setLocation(location);
    }

    getLocation();
  }, []);

  const lat = location?.coords.latitude;

  const long = location?.coords.longitude;

  useEffect(() => {
    async function currentConditions() {
      if (lat === undefined || long === undefined) {
        return;
      }

      try {
        const [openMeteoRes, sevenTimerRes]: [Response, Response] =
          await Promise.all([
            fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=moon_phase&current=is_day,temperature_2m,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,dew_point_2m,`,
            ),
            fetch(
              `https://www.7timer.info/bin/api.pl?lon=${long}&lat=${lat}&product=astro&output=json`,
            ),
          ]);

        const conditions = await openMeteoRes.json();
        const sevenTimerData = await sevenTimerRes.json();

        const currentAstro = sevenTimerData?.dataseries?.[0];

        if (currentAstro) {
          setSeeing(currentAstro.seeing);
          setTransparency(currentAstro.transparency);
        }

        setTemperature(conditions.current.temperature_2m);
        setcloudCover(conditions.current.cloud_cover);
        setcloudCoverLow(conditions.current.cloud_cover_low);
        setcloudCoverMid(conditions.current.cloud_cover_mid);
        setcloudCoverHigh(conditions.current.cloud_cover_high);
        setdewPointTemp(conditions.current.dew_point_2m);
        setMoonPhase(conditions.daily?.moon_phase?.[0]);
        setIsDay(conditions.current.is_day);
      } catch (error) {
        console.log("Error in fetching conditions", error);
      } finally {
        //Statement below allows user to proceed to next screen if conditions are attempted to be fetched.
        setReadyToProceed(true);
      }
    }
    currentConditions();
  }, [lat, long]);

  const farenheit =
    temperature !== undefined ? (temperature * 9) / 5 + 32 : undefined;
  const dewFarenheit =
    dewPointTemp !== undefined ? (dewPointTemp * 9) / 5 + 32 : undefined;

  if (moonPhase != undefined) {
    if (moonPhase == 0.0 || moonPhase == 1.0) {
      Moon = "New Moon";
    }
    if (0.0 < moonPhase && moonPhase < 0.25) {
      Moon = "Waxing Crescent";
    }
    if (moonPhase == 0.25) {
      Moon = "First Quarter";
    }
    if (0.25 < moonPhase && moonPhase < 0.5) {
      Moon = "Waxing Gibbous";
    }
    if (moonPhase == 0.5) {
      Moon = "Full Moon";
    }
    if (0.5 < moonPhase && moonPhase < 0.75) {
      Moon = "Waning Gibbous";
    }
    if (moonPhase == 0.75) {
      Moon = "Last Quarter";
    }
    if (0.75 < moonPhase && moonPhase < 1.0) {
      Moon = "Waning Crescent";
    }
  }

  if (
    cloudCoverHigh != undefined &&
    cloudCoverMid != undefined &&
    cloudCoverLow != undefined &&
    transparency != undefined &&
    seeing != undefined &&
    dewPointTemp != undefined &&
    temperature != undefined &&
    isDay != undefined
  ) {
    //Normalize every data point from 0 to 1
    // 1 is good, 0 is bad
    dataCloudCoverHigh = 1 - cloudCoverHigh / 100;
    dataCloudCoverMid = 1 - cloudCoverMid / 100;
    dataCloudCoverLow = 1 - cloudCoverLow / 100;
    dataTransparency = 1 - (transparency - 1) / 7;
    dataSeeing = 1 - (seeing - 1) / 7;
    if (temperature - dewPointTemp > 5) {
      dataTempDewDiff = 1;
    } else {
      dataTempDewDiff = (temperature - dewPointTemp) / 5;
    }
    if (temperature < -28.8889) {
      dataTemp = 0;
    } else if (temperature > 21.1111) {
      dataTemp = 0.5;
    } else {
      dataTemp = (temperature + 28.8889) / 50;
    }

    //Moon brightness
    const date = new Date();
    const illumination = Illumination(Body.Moon, date);

    illum = illumination.phase_fraction * 100;

    //AstroScore Equation. Cloud cover low, mid, and high is 40%, moon brightness is 30%, transparency and seeing each are 10%, temp-dew point spread is 7.5%, and temperature is 2.5%
    if (isDay == 1) {
      AstronomyScore = 1;
    } else if (dataCloudCoverLow <= 0.1) {
      AstronomyScore = 0;
    } else {
      AstronomyScore =
        5 *
        (dataCloudCoverLow * 0.2 +
          dataCloudCoverMid * 0.125 +
          dataCloudCoverHigh * 0.075 +
          (1 - illum / 100) * 0.3 +
          dataTransparency * 0.1 +
          dataSeeing * 0.1 +
          dataTempDewDiff * 0.075 +
          dataTemp * 0.025);
    }

    console.log("AstronomyScore", AstronomyScore);
    console.log(
      dataCloudCoverLow,
      dataCloudCoverMid,
      dataCloudCoverHigh,
      1 - illum / 100,
      dataTransparency,
      dataSeeing,
      dataTempDewDiff,
      dataTemp,
    );
    console.log(
      dataCloudCoverLow * 0.15,
      dataCloudCoverMid * 0.125,
      dataCloudCoverHigh * 0.125,
      (1 - illum / 100) * 0.3,
      dataTransparency * 0.1,
      dataSeeing * 0.1,
      dataTempDewDiff * 0.075,
      dataTemp * 0.025,
    );
    console.log("Day or Night?", isDay);
  }

  const clearStorage = async () => {
    try {
      const keys = await AsyncStorage.clear();
      console.log("Cleared");
    } catch (error) {
      console.log("Clearing failed", error);
    }
  };

  const askChatBot = async (prompt: string | undefined) => {
    const MODEL_PROMPT = `You are an AI assistant ready to help explain astronomy, stargazing, and light polluton.
    Answer concisely, using no more than 6 sentences for a response, and explain topics in simple, easy-to-understand ways.
    Try to keep the conversation about astronomy, stargazing, and light pollution.
    If the user needs help with their telescope and stargazing, help them. If they want to learn more about light pollution or astronomy, teach them about these topics. 
    This is information about the current conditions relevant to astronomy of the user: 
    Transparency: ${transparencyArray[transparency ? transparency - 1 : 8]?.[1]} or ${transparencyArray[transparency ? transparency - 1 : 8]?.[0]};
    Seeing: ${seeingArray[seeing ? seeing - 1 : 8]?.[1]} or ${seeingArray[seeing ? seeing - 1 : 8]?.[0]};
    Temperature: ${temperature} in Celsius;
    Cloud Cover: 
    low: ${cloudCoverLow != undefined ? cloudCoverLow : " Unavailable "}%,
    mid: ${cloudCoverMid != undefined ? cloudCoverMid : " Unavailable "}%,
    high: ${cloudCoverHigh != undefined ? cloudCoverHigh : " Unavailable "}%,
    and total: ${cloudCover != undefined ? cloudCover : " Unavailable "}%;
    Dew Point Temperature: ${dewPointTemp?.toFixed(0)} in Celsius;
    Moon phase: ${Moon};
    Percent of the Moon illuminated: ${illum?.toFixed(2)}%;
    Lastly, it is ${isDay ? "daytime" : "nighttime"} for the user currently.`;

    if (!prompt) {
      return;
    }
    setIsLoading(true);

    console.log("Prompt", prompt);

    try {
      console.log("Sending a request to Ollama...");
      const chatResponse = await fetch(LLM_CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "astrosage",
          messages: [
            {
              role: "system",
              content: MODEL_PROMPT,
            },
            { role: "user", content: prompt },
          ],
          stream: false,
          options: {
            num_ctx: 2048,
            num_predict: 200,
            stop: ["<|im_start|>", "<|im_end|>"],
          },
        }),
      });

      const data = await chatResponse.json();

      if (!chatResponse.ok) {
        console.error("Ollama error: ", data);
      }

      console.log(data.message.content);
      setResponse(data.message.content);
    } catch (error: any) {
      console.log("Error obtained: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (AstronomyScore.toFixed(0) === "5") {
      handleStorage("Sky");
    }
  });

  // Used to clear Async Storage.
  // useEffect(() => {
  //   clearStorage();
  // });

  //Gets all badges
  useEffect(() => {
    if (isFocused) {
      async function getBadges() {
        try {
          const keys = await AsyncStorage.getAllKeys();
          const result = await AsyncStorage.multiGet(keys);
          const icons = result.map((items) => items[1]);

          setBadges(icons);
        } catch (error) {
          console.log("Error fetching badges earned", error);
        }
      }
      getBadges();
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) console.log("Earth Badge Earned:", isEarned);
  }, [isFocused]);

  useLayoutEffect(() => {
    if (showWelcome) {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: "flex" } });
    }
  }, [showWelcome, navigation]);

  if (showWelcome) {
    return (
      <View style={styles.container}>
        <Animated.View style={{ opacity: fadeAnimation }}>
          <Text style={styles.welcomeText}>Welcome to AstroLight</Text>
          <Pressable
            disabled={!readyToProceed}
            onPress={() => setShowWelcome(false)}
          >
            <Text
              style={[
                styles.welcomeButton,
                { opacity: readyToProceed ? 1 : 0.5 },
              ]}
            >
              Get Started
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  return (
    <ScrollView style={[{ flex: 1 }]}>
      <View style={styles.container}>
        <View style={styles.appTitle}>
          <Text style={styles.appTitleText}>AstroLight</Text>
        </View>

        <View style={styles.astroScorePanel}>
          <Text style={styles.panelTitle}>AstroScore</Text>
          <View style={styles.divider} />
          <Text style={styles.astroScore}>{AstronomyScore.toFixed(0)}</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Badges</Text>
          <View style={styles.divider} />
          <View style={styles.icons}>
            {badges.map((icon, index) => (
              <Ionicons
                key={index}
                name={icon as ComponentProps<typeof Ionicons>["name"]}
                size={28}
                color="black"
                style={{
                  marginLeft: index === 0 ? 0 : 15,
                  padding: 10,
                  backgroundColor: "#0F172A",
                  borderRadius: 10,
                  color:
                    icon === "book"
                      ? "grey"
                      : icon === "earth"
                        ? "green"
                        : icon === "search"
                          ? "white"
                          : icon === "sunny"
                            ? "rgb(131, 195, 224)"
                            : icon === "flash-off"
                              ? "yellow"
                              : "rgb(241, 220, 205)",
                }}
              />
            ))}
          </View>
        </View>

        <View style={styles.astroBotPanel}>
          <Text style={styles.panelTitle}>AstroBot</Text>
          <View style={styles.divider} />
          <View
            style={[
              { flexDirection: "row" },
              { justifyContent: "space-between" },
            ]}
          >
            <TextInput
              style={styles.astroBotInput}
              onChangeText={setPrompt}
              value={prompt}
              placeholder="Ask about astronomy, stargazing, or light pollution!"
              placeholderTextColor="#F8FAFC"
              selectionColor="#6bd0fc"
              keyboardType="default"
              multiline
            />
            <Pressable
              onPress={() => {
                // CALL TO AI FUNCTION
                {
                  askChatBot(prompt);
                }
                setPrompt(" ");
                setResponse(" ");
              }}
              accessibilityRole="button"
              accessibilityLabel="Send message"
              style={[{ alignItems: "center" }, { marginTop: "2.5%" }]}
            >
              <Ionicons
                name={"send-sharp"}
                color={"black"}
                size={15}
                style={[
                  { padding: 7 },
                  { borderRadius: 20 },
                  { backgroundColor: "#6bd0fc" },
                  { transform: [{ rotate: "-90deg" }] },
                ]}
              />
            </Pressable>
          </View>
          {response ? (
            response === " " ? (
              <Text style={styles.generateTag}>Generating</Text>
            ) : (
              <Text style={[styles.astroBotOutput]}>{response}</Text>
            )
          ) : null}
        </View>

        <View
          style={[
            styles.panel,
            {
              marginBottom: "15%",
            },
          ]}
        >
          <Text style={styles.panelTitle}>Current Conditions</Text>
          <View style={styles.divider} />
          {isEarned ? null : (
            <Pressable
              disabled={isEarned}
              onPress={async () => {
                await handleStorage("Environment");
                setIsEarned(true);
              }}
            >
              <Ionicons
                name="earth"
                size={7.5}
                color={"#1f5f27"}
                style={{ alignSelf: "flex-end" }}
              />
            </Pressable>
          )}
          <View style={styles.tempPanel}>
            <Text style={styles.tempTitle}>Temperature: </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.tempText}>{temperature?.toFixed(0)}°C</Text>
              <View style={styles.verticalDivider} />
              <Text style={styles.tempText}>{farenheit?.toFixed(0)}°F</Text>
            </View>
          </View>

          <View style={styles.cloudPanel}>
            <View
              style={[
                { flexDirection: "row", justifyContent: "space-between" },
              ]}
            >
              <Text style={styles.cloudTitle}>Cloud Cover:</Text>

              <Text style={styles.cloudTotal}>
                {cloudCover != undefined ? cloudCover : " - "}%
              </Text>
            </View>
            <View
              style={[
                { flexDirection: "row" },
                { justifyContent: "flex-start" },
              ]}
            >
              <Text style={[styles.cloudSections]}>
                Low: {cloudCoverLow != undefined ? cloudCoverLow : " - "}%
              </Text>
              <Text style={[styles.cloudSections]}>
                Mid: {cloudCoverMid != undefined ? cloudCoverMid : " - "}%
              </Text>
              <Text style={[styles.cloudSections]}>
                High: {cloudCoverHigh != undefined ? cloudCoverHigh : " - "}%
              </Text>
            </View>
          </View>

          <View style={styles.moonPanel}>
            <Text style={styles.moonTitle}>Moon Phase:</Text>
            <Text style={styles.moonText}>{Moon}</Text>
          </View>

          <View style={styles.moonPanel}>
            <Text style={styles.moonTitle}>
              Percent of the Moon Illuminated:
            </Text>

            <Text style={styles.moonText}>{illum?.toFixed(2)}%</Text>
          </View>

          <View style={styles.dewTempPanel}>
            <Text style={styles.dewTempTitle}>Dew Point Temp: </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.dewTempText}>
                {dewPointTemp?.toFixed(0)}°C
              </Text>
              <View style={styles.verticalDivider} />
              <Text style={styles.dewTempText}>
                {dewFarenheit?.toFixed(0)}°F
              </Text>
            </View>
          </View>

          <View style={styles.conditionsPanel}>
            <Text style={styles.conditionsTitle}>Transparency:</Text>
            <View
              style={[
                { flexDirection: "row" },
                { justifyContent: "space-between" },
                { marginTop: "2.5%" },
              ]}
            >
              <Text style={styles.conditionsText}>
                {transparencyArray[transparency ? transparency - 1 : 8]?.[0]}
              </Text>

              <Text style={styles.conditionsTag}>
                {transparencyArray[transparency ? transparency - 1 : 8]?.[1]}
              </Text>
            </View>
          </View>

          <View style={styles.conditionsPanel}>
            <Text style={styles.conditionsTitle}>Seeing:</Text>
            <View
              style={[
                { flexDirection: "row" },
                { justifyContent: "space-between" },
                { marginTop: "2.5%" },
              ]}
            >
              <Text style={styles.conditionsText}>
                {seeingArray[seeing ? seeing - 1 : 8]?.[0]}
              </Text>

              <Text style={styles.conditionsTag}>
                {seeingArray[seeing ? seeing - 1 : 8]?.[1]}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

//STYLESHEET

const styles = StyleSheet.create({
  //WELCOME SCREEN
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#0F172A",
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#6bd0fc",
    marginVertical: "3%",
  },

  verticalDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: "#6bd0fc",
    marginHorizontal: "2.5%",
  },

  panelTitle: {
    fontFamily: "Segoe UI",
    fontSize: 35,
    textAlign: "left",
    color: "#F8FAFC",
  },

  panel: {
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 20,
    marginTop: "7.5%",
    width: "90%",
    borderLeftWidth: 2,
    borderColor: "#6bd0fc",
  },

  welcomeText: {
    textAlign: "left",
    marginLeft: "10%",
    fontFamily: "Segoe UI",
    fontSize: 50,
    color: "#F8FAFC",
  },

  welcomeButton: {
    justifyContent: "center",
    alignSelf: "center",
    textAlign: "center",
    marginTop: "50%",
    width: "80%",

    padding: 20,
    borderRadius: 10,
    backgroundColor: "#6bd0fc",
    fontFamily: "SegoeUI",
    fontWeight: "bold",
    fontSize: 20,
  },

  appTitle: {
    marginTop: "25%",
    marginBottom: "10%",
    marginLeft: "5%",
    alignSelf: "flex-start",
  },

  appTitleText: {
    fontFamily: "Segoe UI",
    fontSize: 60,
    color: "#F8FAFC",
  },

  astroScorePanel: {
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 20,
    marginLeft: "5%",
    alignSelf: "flex-start",
    width: "55%",
    borderLeftWidth: 2,
    borderColor: "#6bd0fc",
  },

  astroScore: {
    fontFamily: "Segoe UI",
    fontSize: 60,
    color: "#F8FAFC",
    marginLeft: "10%",
    marginTop: "3%",
    fontWeight: "bold",
  },

  icons: {
    marginTop: "3%",
    flexDirection: "row",
  },

  tempPanel: {
    backgroundColor: "#0F172A",
    padding: 10,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "3%",
  },

  tempTitle: {
    fontFamily: "Segoe UI",
    fontSize: 24,
    alignSelf: "center",
    color: "#94A3B8",
  },

  tempText: {
    fontFamily: "Segoe UI",
    color: "#F8FAFC",
    fontSize: 25,
  },

  cloudPanel: {
    backgroundColor: "#0F172A",
    padding: 10,
    borderRadius: 15,
    marginTop: "3.5%",
  },

  cloudTitle: {
    fontFamily: "Segoe UI",
    color: "#94A3B8",
    fontSize: 24,
    alignSelf: "center",
  },

  cloudTotal: {
    fontFamily: "Segoe UI",
    color: "#F8FAFC",
    fontSize: 25,
  },

  cloudSections: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: "#1E293B",
    borderRadius: 10,
    marginHorizontal: "1%",
    marginTop: "2.5%",
    color: "#F8FAFC",
    fontFamily: "Segoe UI",
    fontSize: 15,
  },

  moonPanel: {
    backgroundColor: "#0F172A",
    padding: 10,
    borderRadius: 15,
    marginTop: "3.5%",
  },

  moonTitle: {
    fontFamily: "Segoe UI",
    color: "#94A3B8",
    fontSize: 24,
  },

  moonText: {
    fontFamily: "Segoe UI",
    color: "#F8FAFC",
    marginTop: "2.5%",
    fontSize: 25,
  },

  dewTempPanel: {
    backgroundColor: "#0F172A",
    padding: 10,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "3.5%",
  },

  dewTempTitle: {
    fontFamily: "Segoe UI",
    fontSize: 24,
    alignSelf: "center",
    color: "#94A3B8",
  },

  dewTempText: {
    fontFamily: "Segoe UI",
    color: "#F8FAFC",
    fontSize: 25,
  },

  conditionsPanel: {
    backgroundColor: "#0F172A",
    padding: 10,
    borderRadius: 15,
    marginTop: "3.5%",
  },

  conditionsTitle: {
    fontFamily: "Segoe UI",
    fontSize: 24,
    alignSelf: "flex-start",
    color: "#94A3B8",
  },

  conditionsText: {
    fontFamily: "Segoe UI",
    color: "#F8FAFC",
    fontSize: 25,
  },

  conditionsTag: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: "#1E293B",
    borderRadius: 10,
    marginHorizontal: "1%",
    color: "#F8FAFC",
    fontSize: 15,
    fontFamily: "Segoe UI",
  },

  astroBotPanel: {
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 20,
    marginTop: "7.5%",
    width: "90%",
    borderLeftWidth: 2,
    borderColor: "#6bd0fc",
  },

  astroBotInput: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#0F172A",
    marginTop: "3%",
    color: "#F8FAFC",
    width: "85%",
    lineHeight: 20,
    marginBottom: "5%",
    fontSize: 15,
    textAlignVertical: "top",
  },

  astroBotOutput: {
    color: "#F8FAFC",
    fontFamily: "Segoe UI",
    fontSize: 15,
    lineHeight: 23,
  },

  generateTag: {
    padding: 5,
    backgroundColor: "#0F172A",
    color: "#94A3B8",
    borderRadius: 10,
    fontFamily: "Segoe UI",
    fontSize: 15,
    textAlign: "center",
  },
});

export default Dashboard;
