import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import { VStack, Text, Box, HStack, Icon, Pressable, View } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
export default function Contacts() {
  const navigation = useNavigation();
  const route = useRoute();
  const { contacts } = route.params || {};
  const [contactsList, setContactsList] = useState([]);
  useEffect(() => {
    if (contacts && contacts.length > 0) {
      const expandedContacts = [];
      contacts.forEach((contact) => {
        if (contact.phoneNumbers && contact.phoneNumbers.length > 1) {
          contact.phoneNumbers.forEach((number, index) => {
            expandedContacts.push({
              name: `${contact.name} (${index + 1})`,
              phoneNumber: number,
            });
          });
        } else {
          expandedContacts.push({
            name: contact.name,
            phoneNumber:
              contact.phoneNumbers && contact.phoneNumbers[0]
                ? contact.phoneNumbers[0]
                : "No Number",
          });
        }
      });
      setContactsList(expandedContacts);
    }
  }, [contacts]);
  const goBack = () => {
    navigation.goBack();
  };
  const renderContact = ({ item }) => (
    <Box
      bg="white"
      p={4}
      borderRadius={8}
      m={2}
      shadow={2}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <VStack>
        <Text fontSize="md" fontWeight="bold" color="purple.600">
          {item.name}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {item.phoneNumber}
        </Text>
      </VStack>
    </Box>
  );
  return (
    <SafeAreaView style={styles.container}>
      <HStack
        justifyContent="space-between"
        alignItems="center"
        p={2}
        bg="gray.200"
      >
        <Pressable onPress={goBack} p={2}>
          <Icon
            as={MaterialIcons}
            name="arrow-back"
            size="lg"
            color="purple.600"
          />
        </Pressable>
        <Text fontSize="xl" fontWeight="bold" color="purple.600">
          Child Contacts
        </Text>
        <View />
      </HStack>
      {contactsList.length > 0 ? (
        <FlatList
          data={contactsList}
          renderItem={renderContact}
          keyExtractor={(item, index) =>
            `${item.name}-${item.phoneNumber}-${index}`
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Text fontSize="lg" color="gray.500">
            Waiting for contacts data...
          </Text>
        </VStack>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
