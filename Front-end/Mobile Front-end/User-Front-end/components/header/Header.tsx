import React from 'react';
import { Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  const router = useRouter();

  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={() => router.back()} />
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}
