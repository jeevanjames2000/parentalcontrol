import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SectionList } from "react-native";
import { VStack, Box } from "native-base";
import moment from "moment";
const CallLogsComponent = () => {
  return (
    <View style={styles.container}>
      <Text>CallLogs</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
export default CallLogsComponent;
