import AsyncStorage from "@react-native-async-storage/async-storage";

const MEMBER_KEY = "@auth:member";

export async function saveMember(member: any) {
  await AsyncStorage.setItem(MEMBER_KEY, JSON.stringify(member));
}

export async function getStoredMember() {
  const data = await AsyncStorage.getItem(MEMBER_KEY);
  return data ? JSON.parse(data) : null;
}

export async function removeMember() {
  await AsyncStorage.removeItem(MEMBER_KEY);
}
