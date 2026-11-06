import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { Button, Text, ScrollView } from 'react-native';
import { usersTable } from '@/db/schema';
import { db } from '@/db/init';

export default function DBtest() {
  const { data } = useLiveQuery(db.select().from(usersTable));

  async function handleTestInsert() {
    await db.insert(usersTable).values({
      name: "John",
      email: "johncena@gmail.com",
      age: 30
    })
  }


  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 100,
      }}
    >
      <Text>{JSON.stringify(data, null, 2)}</Text>
      <Button title="Test Insert" onPress={handleTestInsert}></Button>
    </ScrollView>
  );
}
