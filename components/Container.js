import React from 'react';
import { View, ScrollView } from 'react-native';

export default function Container(props) {
  const { style, scroll, children, ...rest } = props;

  if (scroll) {
    return (
      <ScrollView contentContainerStyle={style} {...rest}>
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={style} {...rest}>
      {children}
    </View>
  );
}
