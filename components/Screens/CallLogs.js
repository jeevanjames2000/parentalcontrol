import React, { useEffect, useState, useMemo } from "react";
import { StyleSheet, SectionList } from "react-native";
import {
  View,
  Text,
  FlatList,
  Icon,
  Pressable,
  HStack,
  VStack,
  Box,
} from "native-base";
import moment from "moment";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { isEqual } from "lodash";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
const CallLogsComponent = () => {
  const childCallLogs = useSelector((state) => state.child.callLogs || []);
  const [groupedLogs, setGroupedLogs] = useState([]);
  const navigation = useNavigation();
  const getFormattedDate = (date) => {
    const today = moment().format("YYYY-MM-DD");
    const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
    if (date === today) {
      return "Today";
    } else if (date === yesterday) {
      return "Yesterday";
    } else {
      return moment(date).format("MMMM D, YYYY");
    }
  };
  const groupedLogsMemo = useMemo(() => {
    if (!childCallLogs || childCallLogs.length === 0) return [];
    const grouped = childCallLogs.reduce((acc, log) => {
      const date = moment(parseInt(log.timestamp)).format("YYYY-MM-DD");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(log);
      return acc;
    }, {});
    return Object.keys(grouped).map((date) => ({
      title: getFormattedDate(date),
      data: grouped[date],
    }));
  }, [childCallLogs]);
  useEffect(() => {
    if (!isEqual(groupedLogs, groupedLogsMemo)) {
      setGroupedLogs(groupedLogsMemo);
    }
  }, [groupedLogsMemo, groupedLogs]);
  const RenderCallLogItem = React.memo(({ item }) => {
    const formatDuration = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };
    const formattedTime = moment(parseInt(item.timestamp)).format("h:mm A");
    return (
      <Box
        p={3}
        borderBottomWidth={1}
        borderBottomColor="gray.200"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <VStack>
          <Text fontSize="md" fontWeight="bold">
            {item.name || "Unknown"}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {item.phoneNumber || "No Number"}
          </Text>
          <Text fontSize="xs" color="gray.400">
            Duration: {formatDuration(item.duration || 0)} | Type:{" "}
            {item.type || "Unknown"}
          </Text>
        </VStack>
        <Text fontSize="sm" color="gray.500">
          {formattedTime}
        </Text>
      </Box>
    );
  });
  const renderSectionHeader = ({ section: { title } }) => (
    <Box bg="gray.100" p={2}>
      <Text fontSize="lg" fontWeight="bold" color="gray.700">
        {title}
      </Text>
    </Box>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <HStack alignItems="center" p={4}>
        <Pressable onPress={() => navigation.goBack()} p={2}>
          <Icon as={MaterialIcons} name="arrow-back" size="lg" color="black" />
        </Pressable>
        <Text fontSize="lg" fontWeight="bold" ml={4}>
          Call Logs
        </Text>
      </HStack>
      <SectionList
        sections={groupedLogs}
        keyExtractor={(item, index) => `${item.timestamp}-${index}`}
        renderItem={({ item }) => <RenderCallLogItem item={item} />}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No call logs available</Text>
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    color: "gray",
  },
});
export default CallLogsComponent;
