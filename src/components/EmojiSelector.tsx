import { StyleSheet, Text, Pressable } from 'react-native'
import React, { Component } from 'react'
import emojiJson from '../assets/json/emoji.json'
import { FlashList } from '@shopify/flash-list'
import { VStack } from 'native-base'
export class EmojiItem extends Component {
  render(): React.ReactNode {
    return (
      <VStack p={5} style={styles.emojiBox}>
        {Object.keys(this.props.jsonData).map((em) => (
          <Pressable
            key={em}
            onPressIn={() =>
              this.props.onPress(emojiJson[em])
            }
          >
            <Text style={styles.fontStyle}>
              {emojiJson[em]}
            </Text>
          </Pressable>
        ))}
      </VStack>
    )
  }
}
export class EmojiSelector extends Component {
  renderItem = ({ item }: any) => {
    return (
      <EmojiItem
        jsonData={item}
        onPress={this.props.selectEmoji}
      />
    )
  }
  render() {
    const colData = Object.keys(emojiJson)
    const result = []
    for (let i = 0; i < colData.length; i += 6) {
      result.push(
        colData
          .slice(i, i + 6)
          .reduce((acc: any, key: any) => {
            acc[key] = emojiJson[key]
            return acc
          }, {})
      )
    }
    return (
      <FlashList
        data={result}
        renderItem={this.renderItem}
        keyExtractor={(v, i) => i + ''}
        estimatedItemSize={24}
      ></FlashList>
    )
  }
}
const styles = StyleSheet.create({
  emojiBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fontStyle: {
    fontSize: 18,
  },
})
export default EmojiSelector
