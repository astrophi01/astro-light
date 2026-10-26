import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface skyProps {
  skyPressed: boolean;
  setSkyPressed: Dispatch<SetStateAction<boolean>>;
  isFocused: boolean;
}

interface bortleProps {
  bortlePressed: boolean;
  setBortlePressed: Dispatch<SetStateAction<boolean>>;
  isFocused: boolean;
}

interface environmentProps {
  environmentPressed: boolean;
  setEnvironmentPressed: Dispatch<SetStateAction<boolean>>;
  isFocused: boolean;
}

interface clusterProps {
  clusterPressed: boolean;
  setClusterPressed: Dispatch<SetStateAction<boolean>>;
  isFocused: boolean;
}
interface lightProps {
  lightPressed: boolean;
  setLightPressed: Dispatch<SetStateAction<boolean>>;
  isFocused: boolean;
}

//Stores a badge with its icon if not already stored
const handleStorage = async (value: string) => {
  try {
    switch (value) {
      case "Bortle": {
        const notFound = (await AsyncStorage.getItem("Bortle")) === null;
        if (notFound) {
          await AsyncStorage.setItem("Bortle", "book");
        }
        break;
      }
      case "Light": {
        const notFound = (await AsyncStorage.getItem("Light")) === null;
        if (notFound) {
          await AsyncStorage.setItem("Light", "flash-off");
        }
        break;
      }
    }
  } catch (error) {
    console.error("Couldn't save bortle badge", error);
  }
};

function Sky({ isFocused, skyPressed, setSkyPressed }: skyProps) {
  const [isEarned, setIsEarned] = useState<boolean>();

  //check if badge is earned
  useEffect(() => {
    async function earned() {
      if (isFocused) {
        const check = await AsyncStorage.getItem("Sky");
        const earnedBadge = check !== null;
        setIsEarned(earnedBadge);
      }
    }
    earned();
  });

  useEffect(() => {
    if (isFocused) {
      console.log("Hunter", isEarned);
    }
  });

  if (!skyPressed) {
    return (
      <Pressable
        style={[styles.badgePanel, { marginTop: "5%" }, { marginBottom: "5%" }]}
        onPress={() => setSkyPressed(true)}
      >
        <View style={styles.header}>
          <View style={styles.subHeader}>
            <Ionicons
              name="search"
              size={25}
              color="white"
              style={styles.badgeIcon}
            />
            <Text style={styles.badgeTitle}>Optimal Sky Hunter</Text>
          </View>
          <Text
            style={[
              styles.earned,
              { backgroundColor: isEarned ? "#38BDF8" : "#EF4444" },
            ]}
          >
            {isEarned ? "Earned" : "Unearned"}
          </Text>
        </View>
        <Text style={styles.description}>
          Optimal conditions for stargazing can occur once in a while on some
          good nights. Can you catch that night?{" "}
        </Text>
      </Pressable>
    );
  }
  if (skyPressed) {
    return (
      <Pressable
        style={[styles.badgePanel, { marginTop: "5%" }, { marginBottom: "5%" }]}
        onPress={() => setSkyPressed(false)}
      >
        <View style={styles.header}>
          <View style={styles.subHeader}>
            <Ionicons
              name="search"
              size={25}
              color="white"
              style={styles.badgeIcon}
            />
            <Text style={styles.badgeTitle}>Optimal Sky Hunter</Text>
          </View>
          <Text
            style={[
              styles.earned,
              { backgroundColor: isEarned ? "#38BDF8" : "#EF4444" },
            ]}
          >
            {isEarned ? "Earned" : "Unearned"}
          </Text>
        </View>

        <Text style={styles.badgeActionContainer}>
          Open the app when the AstroScore is 5.
        </Text>
      </Pressable>
    );
  }
}

function Bortle({ isFocused, bortlePressed, setBortlePressed }: bortleProps) {
  const [required, setRequired] = useState(0);
  const [isEarned, setIsEarned] = useState<boolean>();

  //check if badge is earned
  useEffect(() => {
    async function earned() {
      if (isFocused) {
        const check = await AsyncStorage.getItem("Bortle");
        const earnedBadge = check !== null;
        setIsEarned(earnedBadge);
        if (earnedBadge) {
          setRequired(3);
        }
      }
    }
    earned();
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      console.log(isEarned);
    }
  });

  if (!bortlePressed) {
    return (
      <Pressable
        style={styles.badgePanel}
        onPress={() => setBortlePressed(true)}
      >
        <View style={styles.header}>
          <View style={styles.subHeader}>
            <Ionicons
              name="book"
              size={25}
              color="grey"
              style={styles.badgeIcon}
            />
            <Text style={styles.badgeTitle}>Bortle Scholar</Text>
          </View>
          <Text
            style={[
              styles.earned,
              { backgroundColor: isEarned ? "#38BDF8" : "#EF4444" },
            ]}
          >
            {isEarned ? "Earned" : "Unearned"}
          </Text>
        </View>
        <Text style={styles.description}>
          Learn about how astronomers measure light polluted the night sky is
        </Text>
      </Pressable>
    );
  }

  if (bortlePressed) {
    return (
      <Pressable
        style={styles.badgePanel}
        onPress={() => setBortlePressed(false)}
      >
        <View style={styles.header}>
          <View style={styles.subHeader}>
            <Ionicons
              name="book"
              size={25}
              color="grey"
              style={styles.badgeIcon}
            />
            <Text style={styles.badgeTitle}>Bortle Scholar</Text>
          </View>
          <Text
            style={[
              styles.earned,
              { backgroundColor: isEarned ? "#38BDF8" : "#EF4444" },
            ]}
          >
            {isEarned ? "Earned" : "Unearned"}
          </Text>
        </View>
        <View style={styles.badgeActionContainer}>
          <Text style={styles.reading}>
            Astronomers use the bortle scale to classify how light polluted and
            dark their night sky is. There are nine bortle scale
            classifications, ranging from 1 to 9.
          </Text>

          <Text style={[styles.reading, { marginTop: 10 }]}>
            Bortle Scale 1 represents an exceptionally dark sky, while Bortle
            Scale 9 represents a city sky. So, the higher the bortle scale
            number, the more light polluted the night sky is.
          </Text>

          <TouchableOpacity
            style={[styles.button, { alignSelf: "center" }]}
            onPress={() => setRequired((prev) => prev + 1)}
            disabled={required > 0}
          >
            <Text
              style={{
                color: "#1E293B",
                textAlign: "center",
              }}
            >
              {required < 1 ? "Got it!" : "Completed"}
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <Text style={styles.reading}>
            While the Bortle Scale is an easy way for astronomers to classify
            night skies, every astronomer can classify a given night sky
            differently. One may classify a night sky as a Bortle 5, but another
            may classify the same sky as a Bortle 6. The objective version of
            the Bortle Scale are Sky Quality Meter {"("}SQM{")"} values. These
            values are determined via a Sky Quality Meter.
          </Text>
          <Text style={[styles.reading, { marginTop: 10 }]}>
            SQM values from 20 to 22.4 represent pristine skies, and SQM values
            of 16 to 16.5 represent city skies. This time, the lower the SQM
            value, the more light polluted the night sky is.
          </Text>
          <TouchableOpacity
            style={[styles.button, { alignSelf: "center" }]}
            onPress={() => setRequired((prev) => prev + 1)}
            disabled={required == 0 || required > 1}
          >
            <Text
              style={{
                color: "#1E293B",
                textAlign: "center",
              }}
            >
              {required < 2 ? "Got it!" : "Completed"}
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <Text style={[styles.reading]}>
            Unfortunately, many people around the world live in areas where
            night skies are polluted so signficantly by artifical light that
            they cannot gaze upon the spectacle of a pristine sky.
          </Text>
          <Text style={[styles.reading, { marginTop: 10 }]}>
            Still, people have come together to fight light pollution, and
            efforts have been made to bring back pristine skies.
          </Text>
          <TouchableOpacity
            style={[styles.button, { width: "65%" }, { alignSelf: "center" }]}
            onPress={async () => {
              setRequired(3);
              await handleStorage("Bortle");
              setIsEarned(true);
            }}
            disabled={required <= 1 || required > 2}
          >
            <Text
              style={{
                color: "#1E293B",
                textAlign: "center",
              }}
            >
              {required == 3
                ? "Bortle Scholar Badge Earned!"
                : "Earn Bortle Scholar Badge"}
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  }
}

function Environment({
  isFocused,
  environmentPressed,
  setEnvironmentPressed,
}: environmentProps) {
  const [isEarned, setIsEarned] = useState<boolean>();

  //check if badge is earned
  useEffect(() => {
    async function earned() {
      if (isFocused) {
        const check = await AsyncStorage.getItem("Environment");
        const earnedBadge = check !== null;

        setIsEarned(earnedBadge);
      }
    }
    earned();
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      console.log("Environment", isEarned);
    }
  });

  if (!environmentPressed) {
    return (
      <Pressable
        style={[styles.badgePanel, { marginTop: "5%" }]}
        onPress={() => setEnvironmentPressed(true)}
      >
        <View style={styles.header}>
          <View style={styles.subHeader}>
            <Ionicons
              name="earth"
              size={25}
              color="green"
              style={styles.badgeIcon}
            />
            <Text style={styles.badgeTitle}>Eco-advocate</Text>
          </View>
          <Text
            style={[
              styles.earned,
              { backgroundColor: isEarned ? "#38BDF8" : "#EF4444" },
            ]}
          >
            {isEarned ? "Earned" : "Unearned"}
          </Text>
        </View>
        <Text style={styles.description}>
          Light pollution doesn't just affect humans. It affects the
          environment. Light pollution affects animals that roam the Earth.
        </Text>
      </Pressable>
    );
  }
  if (environmentPressed) {
    return (
      <Pressable
        style={[styles.badgePanel, { marginTop: "5%" }]}
        onPress={() => setEnvironmentPressed(false)}
      >
        <View style={styles.header}>
          <View style={styles.subHeader}>
            <Ionicons
              name="earth"
              size={25}
              color="green"
              style={styles.badgeIcon}
            />
            <Text style={styles.badgeTitle}>Eco-advocate</Text>
          </View>
          <Text
            style={[
              styles.earned,
              { backgroundColor: isEarned ? "#38BDF8" : "#EF4444" },
            ]}
          >
            {isEarned ? "Earned" : "Unearned"}
          </Text>
        </View>
        <View style={styles.badgeActionContainer}>
          <Text style={styles.reading}>
            Find the "Earth" hidden in the app.
          </Text>
        </View>
      </Pressable>
    );
  }
}

function Cluster({
  isFocused,
  clusterPressed,
  setClusterPressed,
}: clusterProps) {
  const [isEarned, setIsEarned] = useState<boolean>();

  //check if badge is earned
  useEffect(() => {
    async function earned() {
      if (isFocused) {
        const check = await AsyncStorage.getItem("Cluster");
        const earnedBadge = check !== null;

        setIsEarned(earnedBadge);
      }
    }
    earned();
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      console.log("Cluster", isEarned);
    }
  });

  if (!clusterPressed) {
    return (
      <Pressable
        style={[styles.badgePanel, { marginTop: "5%" }]}
        onPress={() => setClusterPressed(true)}
      >
        <View style={styles.header}>
          <View style={styles.subHeader}>
            <Ionicons
              name="sunny"
              size={25}
              color="rgb(131, 195, 224)"
              style={styles.badgeIcon}
            />
            <Text style={styles.badgeTitle}>Pleiades Pioneer</Text>
          </View>
          <Text
            style={[
              styles.earned,
              { backgroundColor: isEarned ? "#38BDF8" : "#EF4444" },
            ]}
          >
            {isEarned ? "Earned" : "Unearned"}
          </Text>
        </View>
        <Text style={styles.description}>
          The visualizer puts into perspective just how many stars there are in
          our universe. There are so many that even the Pleaides, a star cluster
          that is rather easy to find in the light polluted skies of today,
          becomes largely unrecognizable at a glance.
        </Text>
      </Pressable>
    );
  }
  if (clusterPressed) {
    return (
      <Pressable
        style={[styles.badgePanel, { marginTop: "5%" }]}
        onPress={() => setClusterPressed(false)}
      >
        <View style={styles.header}>
          <View style={styles.subHeader}>
            <Ionicons
              name="sunny"
              size={25}
              color="rgb(131, 195, 224)"
              style={styles.badgeIcon}
            />
            <Text style={styles.badgeTitle}>Pleiades Pioneer</Text>
          </View>
          <Text
            style={[
              styles.earned,
              { backgroundColor: isEarned ? "#38BDF8" : "#EF4444" },
            ]}
          >
            {isEarned ? "Earned" : "Unearned"}
          </Text>
        </View>
        <View style={styles.badgeActionContainer}>
          <Text style={styles.reading}>
            Find the Pleiades in the vastness of the stars in the Visualizer
            tab.
          </Text>
        </View>
      </Pressable>
    );
  }
}

function Light({ isFocused, lightPressed, setLightPressed }: lightProps) {
  const [isEarned, setIsEarned] = useState<boolean>();
  const [first, setFirst] = useState<boolean>(true);
  const [firstAnswer, setFirstAnswer] = useState<boolean>(false);
  const [second, setSecond] = useState<boolean>(true);
  const [secondAnswer, setSecondAnswer] = useState<boolean>(false);
  const [third, setThird] = useState<boolean>(true);
  const [thirdAnswer, setThirdAnswer] = useState<boolean>(false);
  const [fourth, setFourth] = useState<boolean>(true);
  const [fourthAnswer, setFourthAnswer] = useState<boolean>(false);
  const [fifth, setFifth] = useState<boolean>(true);
  const [fifthAnswer, setFifthAnswer] = useState<boolean>(false);
  const [tryAgain, setTryAgain] = useState<boolean>(false);
  const [correct, setCorrect] = useState<number>(0);

  //check if badge is earned
  useEffect(() => {
    async function earned() {
      if (isFocused) {
        const check = await AsyncStorage.getItem("Light");
        const earnedBadge = check !== null;
        if (earnedBadge) {
          setFirst(false);
          setSecond(false);
          setThird(false);
          setFourth(false);
          setFifth(false);
          setFirstAnswer(true);
          setSecondAnswer(true);
          setThirdAnswer(true);
          setFourthAnswer(true);
          setFifthAnswer(true);
          setCorrect(5);
        }
        setIsEarned(earnedBadge);
      }
    }
    earned();
  }, [isFocused]);

  useEffect(() => {
    async function isCorrect() {
      if (correct === 5) {
        await handleStorage("Light");
        setIsEarned(true);
        setFirst(false);
        setSecond(false);
        setThird(false);
        setFourth(false);
        setFifth(false);
        setFirstAnswer(true);
        setSecondAnswer(true);
        setThirdAnswer(true);
        setFourthAnswer(true);
        setFifthAnswer(true);
        setCorrect(5);
      }
    }
    isCorrect();
  }, [correct]);

  async function handleFail() {
    setFirst(true);
    setSecond(true);
    setThird(true);
    setFourth(true);
    setFifth(true);
    setFirstAnswer(false);
    setSecondAnswer(false);
    setThirdAnswer(false);
    setFourthAnswer(false);
    setFifthAnswer(false);
    setTryAgain(true);
    setCorrect(0);
  }

  useEffect(() => {
    if (isFocused) {
      console.log("Light", isEarned);
    }
  });

  if (!lightPressed) {
    return (
      <Pressable
        style={[styles.badgePanel, { marginTop: "5%" }]}
        onPress={() => setLightPressed(true)}
      >
        <View style={styles.header}>
          <View style={styles.subHeader}>
            <Ionicons
              name="flash-off"
              size={25}
              color="yellow"
              style={styles.badgeIcon}
            />
            <Text style={styles.badgeTitle}>Light Educated</Text>
          </View>
          <Text
            style={[
              styles.earned,
              { backgroundColor: isEarned ? "#38BDF8" : "#EF4444" },
            ]}
          >
            {isEarned ? "Earned" : "Unearned"}
          </Text>
        </View>
        <Text style={styles.description}>
          Complete a quiz on actionable steps to reduce light pollution in your
          own life.
        </Text>
      </Pressable>
    );
  }
  if (lightPressed) {
    return (
      <Pressable
        style={[styles.badgePanel, { marginTop: "5%" }]}
        onPress={() => setLightPressed(false)}
      >
        <View style={styles.header}>
          <View style={styles.subHeader}>
            <Ionicons
              name="flash-off"
              size={25}
              color="yellow"
              style={styles.badgeIcon}
            />
            <Text style={styles.badgeTitle}>Light Educated</Text>
          </View>
          <Text
            style={[
              styles.earned,
              { backgroundColor: isEarned ? "#38BDF8" : "#EF4444" },
            ]}
          >
            {isEarned ? "Earned" : "Unearned"}
          </Text>
        </View>
        <View style={styles.badgeActionContainer}>
          <Text style={styles.numCorrect}>
            {!first
              ? `${correct} / 5`
              : tryAgain
                ? "Try Again"
                : "Choose your answers"}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.questions}>
            Should you install outdoor light fixtures that direct light...
          </Text>

          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <TouchableOpacity
              disabled={!first}
              onPress={() => {
                setFirst(false);
                setFirstAnswer(true);
                setCorrect((prev) => prev + 1);
              }}
              style={[styles.button, { width: "25%" }]}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#1E293B",
                }}
              >
                Down
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!first}
              onPress={() => setFirst(false)}
              style={[styles.button, { width: "25%" }, { marginLeft: 5 }]}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#1E293B",
                }}
              >
                Sideways
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!first}
              onPress={() => setFirst(false)}
              style={[styles.button, { width: "25%" }, { marginLeft: 5 }]}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#1E293B",
                }}
              >
                Up
              </Text>
            </TouchableOpacity>
          </View>
          {first ? null : (
            <Text
              style={[
                styles.correct,
                { alignSelf: "center" },
                { color: firstAnswer ? "#98FF98" : "#FF6B6B" },
              ]}
            >
              {firstAnswer ? "Correct" : "Incorrect"}
            </Text>
          )}
          <View style={styles.divider} />

          <Text style={styles.questions}>
            Should you user dimmer, warmer lights {"(<"}3000K{")"}, or brighter,
            blue lights?
          </Text>

          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <TouchableOpacity
              disabled={first || !second}
              onPress={() => setSecond(false)}
              style={[styles.button, { width: "27%" }]}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#1E293B",
                }}
              >
                Blue lights
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={first || !second}
              onPress={() => {
                setSecond(false);
                setSecondAnswer(true);
                setCorrect((prev) => prev + 1);
              }}
              style={[styles.button, { width: "27%" }, { marginLeft: 5 }]}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#1E293B",
                }}
              >
                Warm lights
              </Text>
            </TouchableOpacity>
          </View>
          {second ? null : (
            <Text
              style={[
                styles.correct,
                { alignSelf: "center" },
                { color: secondAnswer ? "#98FF98" : "#FF6B6B" },
              ]}
            >
              {secondAnswer ? "Correct" : "Incorrect"}
            </Text>
          )}
          <View style={styles.divider} />
          <Text style={styles.questions}>
            Which of these types of lights would be the best to install outside
            your house?
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
            }}
          >
            <TouchableOpacity
              disabled={first || second || !third}
              onPress={() => setThird(false)}
              style={[styles.button, { width: "32%" }]}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#1E293B",
                }}
                textBreakStrategy="simple"
              >
                Blue, some shielding, motion sensored
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={first || second || !third}
              onPress={() => {
                setThird(false);
              }}
              style={[styles.button, { width: "32%" }, { marginLeft: 5 }]}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#1E293B",
                }}
                textBreakStrategy="simple"
              >
                Not motion sensored, not shielded, {">3000k"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={first || second || !third}
              onPress={() => {
                setThird(false);
                setThirdAnswer(true);
                setCorrect((prev) => prev + 1);
              }}
              style={[styles.button, { width: "32%" }, { marginLeft: 5 }]}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#1E293B",
                }}
                textBreakStrategy="simple"
              >
                Motion sensored, warm, fully shielded
              </Text>
            </TouchableOpacity>
          </View>
          {third ? null : (
            <Text
              style={[
                styles.correct,
                { alignSelf: "center" },
                { color: thirdAnswer ? "#98FF98" : "#FF6B6B" },
              ]}
            >
              {thirdAnswer ? "Correct" : "Incorrect"}
            </Text>
          )}
          <View style={styles.divider} />
          <Text style={styles.questions}>
            When should you turn on your indoor lights at night?
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
            }}
          >
            <TouchableOpacity
              disabled={first || second || third || !fourth}
              onPress={() => setFourth(false)}
              style={[styles.button, { width: "30%" }]}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#1E293B",
                }}
              >
                Never
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={first || second || third || !fourth}
              onPress={() => {
                setFourth(false);
                setFourthAnswer(true);
                setCorrect((prev) => prev + 1);
              }}
              style={[styles.button, { width: "30%" }, { marginLeft: 5 }]}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#1E293B",
                }}
              >
                Only when needed
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={first || second || third || !fourth}
              onPress={() => {
                setFourth(false);
              }}
              style={[styles.button, { width: "30%" }, { marginLeft: 5 }]}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#1E293B",
                }}
              >
                At sunset
              </Text>
            </TouchableOpacity>
          </View>
          {fourth ? null : (
            <Text
              style={[
                styles.correct,
                { alignSelf: "center" },
                { color: fourthAnswer ? "#98FF98" : "#FF6B6B" },
              ]}
            >
              {fourthAnswer ? "Correct" : "Incorrect"}
            </Text>
          )}
          <View style={styles.divider} />
          <Text style={styles.questions}>
            Light pollution affects us and the environment in many ways. How can
            you act in your community to bring change regarding light pollution?
          </Text>

          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <TouchableOpacity
              disabled={first || second || third || fourth || !fifth}
              onPress={async () => {
                setFifth(false);
                setFifthAnswer(true);
                setCorrect((prev) => prev + 1);
                const newScore = correct + 1;
                if (newScore !== 5) {
                  await handleFail();
                }
              }}
              style={[styles.button, { width: "30%" }]}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#1E293B",
                }}
              >
                Support local laws against light pollution
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={first || second || third || fourth || !fifth}
              onPress={async () => {
                setFifth(false);
                setFifthAnswer(true);
                setCorrect((prev) => prev + 1);
                const newScore = correct + 1;
                if (newScore !== 5) {
                  await handleFail();
                }
              }}
              style={[styles.button, { width: "30%" }, { marginLeft: 5 }]}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#1E293B",
                }}
              >
                Spread awareness about light pollution
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={first || second || third || fourth || !fifth}
              onPress={async () => {
                setFifth(false);
                const newScore = correct + 1;
                if (newScore !== 5) {
                  await handleFail();
                }
              }}
              style={[styles.button, { width: "30%" }, { marginLeft: 5 }]}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#1E293B",
                }}
              >
                Ask your neighbors to avoid using speakers
              </Text>
            </TouchableOpacity>
          </View>
          {fifth ? null : (
            <Text
              style={[
                styles.correct,
                { alignSelf: "center" },
                { color: fifthAnswer ? "#98FF98" : "#FF6B6B" },
              ]}
            >
              {fifthAnswer ? "Correct" : "Incorrect"}
            </Text>
          )}
        </View>
      </Pressable>
    );
  }
}

const badges = () => {
  // const storeData = async (key,value)=>{
  const [bortlePressed, setBortlePressed] = useState(false);
  const [skyPressed, setSkyPressed] = useState(false);
  const [environmentPressed, setEnvironmentPressed] = useState(false);
  const [clusterPressed, setClusterPressed] = useState(false);
  const [lightPressed, setLightPressed] = useState(false);
  const isFocused = useIsFocused();

  const scrollRef = useRef<ScrollView>(null);

  // Resets all states, meaning badge modules are all closed. Optional
  useEffect(() => {
    if (!isFocused) {
      setBortlePressed(false);
      setEnvironmentPressed(false);
      setClusterPressed(false);
      setSkyPressed(false);
      setLightPressed(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [isFocused]);

  //Check to see if Bortle Scholar badge even saved in Async Storage
  // useEffect(() => {
  //   async function saved() {
  //     const isSaved = (await AsyncStorage.getItem("Bortle")) !== null;
  //     // console.log(isSaved);
  //   }
  //   saved();
  // }, [isFocused]);

  return (
    <ScrollView
      style={[{ flex: 1 }, { backgroundColor: "#0F172A" }]}
      ref={scrollRef}
    >
      <Text style={styles.screenTitle}>Badges</Text>
      <Text style={styles.subTitle}>Click each badge to learn more</Text>
      <View style={styles.container}>
        <Bortle
          isFocused={isFocused}
          bortlePressed={bortlePressed}
          setBortlePressed={setBortlePressed}
        />
        <Environment
          isFocused={isFocused}
          environmentPressed={environmentPressed}
          setEnvironmentPressed={setEnvironmentPressed}
        />
        <Cluster
          isFocused={isFocused}
          clusterPressed={clusterPressed}
          setClusterPressed={setClusterPressed}
        />
        <Light
          isFocused={isFocused}
          lightPressed={lightPressed}
          setLightPressed={setLightPressed}
        />
        <Sky
          isFocused={isFocused}
          skyPressed={skyPressed}
          setSkyPressed={setSkyPressed}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#0F172A",
    marginVertical: "5%",
  },

  screenTitle: {
    fontSize: 60,
    fontFamily: "SegoeUI",
    textAlign: "center",
    marginTop: "25%",
    color: "#F8FAFC",
    alignSelf: "flex-start",
    marginLeft: "5%",
    marginBottom: "7.5%",
  },

  subTitle: {
    fontSize: 20,
    fontFamily: "SegoeUI",
    textAlign: "center",
    color: "#F8FAFC",
    alignSelf: "flex-start",
    marginLeft: "5%",
    marginBottom: "7.5%",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    marginTop: "5%",
    backgroundColor: "#8193a8",
    padding: 5,
    borderRadius: 5,
    width: "40%",
    justifyContent: "center",
  },

  reading: {
    fontSize: 15,
    fontFamily: "Segoe UI",
    lineHeight: 25,
  },

  badgePanel: {
    backgroundColor: "#1E293B",
    width: "90%",
    padding: 15,
    borderRadius: 20,
    borderRightWidth: 2,
    borderColor: "#6bd0fc",
  },

  badgeIcon: {
    padding: 5,
    backgroundColor: "#0F172A",
    borderRadius: 10,

    alignSelf: "center",
  },

  badgeTitle: {
    fontSize: 25,
    marginLeft: "5%",
    color: "#F8FAFC",
  },

  subHeader: {
    flexDirection: "row",
  },

  earned: {
    padding: 5,
    borderRadius: 10,

    fontFamily: "Segoe UI",
    fontWeight: "bold",
    fontSize: 12,
    alignSelf: "center",
    color: "#F8FAFC",
  },

  description: {
    backgroundColor: "#94A3B8",
    padding: 10,
    marginTop: "5%",
    borderRadius: 20,
    fontFamily: "Segoe UI",
    fontSize: 15,
    lineHeight: 25,
  },

  badgeActionContainer: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#94A3B8",
    marginTop: "5%",
  },

  questions: {
    fontSize: 15,
    fontFamily: "Segoe UI",
    lineHeight: 25,
    color: "#404850",
  },
  numCorrect: {
    fontFamily: "Segoe UI",
    fontSize: 15,
    alignSelf: "center",
    padding: 5,
    borderRadius: 10,
    backgroundColor: "#1E293B",
    color: "#F8FAFC",
  },

  correct: {
    marginTop: "5%",
    padding: 5,
    borderRadius: 10,
    backgroundColor: "#153466",
  },
});

export default badges;
