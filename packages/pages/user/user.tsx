import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Shadow } from 'react-native-shadow-2';
import { Box } from 'native-base';
const User = ({ socket }: any) => {
  return (
    <Box flex="1" bg="#ffffff" position="relative">
      <Shadow
        distance={100}
        startColor="#ffffff"
        endColor="rgba(135,177,212,.12)"
        offset={[0, 0]}
        containerStyle={{
          position: 'absolute',
          right: 0,
          top: 0,
        }}
        style={{
          width: 150,
          height: 150,
          borderRadius: 75,
        }}
      ></Shadow>
    </Box>
  );
};

export default User;
