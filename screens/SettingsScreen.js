import React from "react";
import { SectionList, Image, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { AsyncStorage } from "react-native";
import { Constants } from "expo";

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: "Settings",
    headerTitleStyle: {
      color: "white",
      alignSelf: "center"
    },
    headerStyle: {
      backgroundColor: Colors.fgDark
    }
  };

  constructor() {
    super();

    this.state = {
      retirementAge: 65,
      inflationRate: "3.5 %",
      annualRates: "[2, 4, 8, 10] %"
    };
  }

  _setCalcConstants = async () => {
    try {
      await AsyncStorage.setItem("@constant:retirementAge", "65");
      await AsyncStorage.setItem("@constant:annualRates", "0.04~0.06~0.08~0.1");
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { manifest } = Constants;
    const sections = [
      {
        data: [
          {
            value:
              "The age at which most people normally retire from work, default age set to 65.",
            constant: this.state.retirementAge
          }
        ],
        title: "Retirement Age"
      },
      {
        data: [
          {
            value:
              "Inflation indicates a decrease in the purchasing power of a nation's currency, default value is 3.5%",
            constant: this.state.inflationRate
          }
        ],
        title: "Inflation"
      },
      {
        data: [
          {
            value:
              "Is the interest rate for a whole year, rather than just a monthly fee/rate, as applied on a loan, mortgage loan, credit card, etc. It is a finance charge expressed as an annual rate",
              constant: this.state.annualRates
          }
        ],
        title: "Annual Rates"
      }
    ];
    return (
      <SectionList
        style={styles.container}
        renderItem={this._renderItem}
        renderSectionHeader={this._renderSectionHeader}
        stickySectionHeadersEnabled={true}
        keyExtractor={(item, index) => index}
        ListHeaderComponent={ListHeader}
        sections={sections}
      />
    );
  }

  _renderSectionHeader = ({ section }) => {
    return (
    <SectionHeader title={section.title} />
    );
  };

  _renderItem = ({ item }) => {
    if (item.type === "color") {
      return (
        <SectionContent>
          {item.value && <Color value={item.value} />}
        </SectionContent>
      );
    } else {
      return (
        <SectionContent>
          <Text
            style={{
              fontWeight: "bold",
              marginTop: "1.5%",
              marginBottom: "1.5%",
              fontSize: 20,
              alignSelf: "center"
            }}
          >
            {item.constant}
          </Text>
          <Text style={styles.sectionContentText}>{item.value}</Text>
        </SectionContent>
      );
    }
  };
}

const ListHeader = () => {
  const { manifest } = Constants;

  return (
    <View style={styles.titleContainer}>
      <View style={styles.titleIconContainer}>
        <AppIconPreview iconUrl={manifest.iconUrl} />
      </View>

      <View style={styles.titleTextContainer}>
        <Text style={styles.nameText} numberOfLines={1}>
          Financial Calculator TM
        </Text>

        <Text style={styles.slugText} numberOfLines={1}>
          By KVN Software Solutions
        </Text>

        <Text style={styles.descriptionText}>Feel free to change the value of constants below</Text>
        <Text>Edit</Text>
      </View>    

    </View>
  );
};

const SectionHeader = ({ title }) => {
  return (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
};

const SectionContent = props => {
  return <View style={styles.sectionContentContainer}>{props.children}</View>;
};

const AppIconPreview = ({ iconUrl }) => {
  if (!iconUrl) {
    iconUrl =
      "https://s3.amazonaws.com/exp-brand-assets/ExponentEmptyManifest_192.png";
  }

  return (
    <Image
      source={require("../assets/images/icon.png")}
      style={{ width: 64, height: 64 }}
      resizeMode="cover"
    />
  );
};

const Color = ({ value }) => {
  if (!value) {
    return <View />;
  } else {
    return (
      <View style={styles.colorContainer}>
        <View style={[styles.colorPreview, { backgroundColor: value }]} />
        <View style={styles.colorTextContainer}>
          <Text style={styles.sectionContentText}>{value}</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  titleContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: "row"
  },
  titleIconContainer: {
    marginRight: 15,
    paddingTop: 2
  },
  sectionHeaderContainer: {
    backgroundColor: "#fbfbfb",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ededed"
  },
  sectionHeaderText: {
    fontSize: 14
  },
  sectionContentContainer: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 15
  },
  sectionContentText: {
    color: "#808080",
    fontSize: 14
  },
  nameText: {
    fontWeight: "600",
    fontSize: 18
  },
  slugText: {
    color: "#a39f9f",
    fontSize: 14,
    backgroundColor: "transparent"
  },
  descriptionText: {
    fontSize: 14,
    marginTop: 6,
    color: "#4d4d4d"
  },
  colorContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  colorPreview: {
    width: 17,
    height: 17,
    borderRadius: 2,
    marginRight: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc"
  },
  colorTextContainer: {
    flex: 1
  }
});
