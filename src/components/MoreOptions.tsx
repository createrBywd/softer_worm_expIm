import { StyleSheet } from 'react-native';
import React, { Component } from 'react';
import { HStack, VStack, Center, Image, Toast } from 'native-base';
import FontAwesome from 'react-native-vector-icons/Entypo';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

export default class moreOptions extends Component {
  uploadPicture: (uri: string, type: string) => void;
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      file: null,
    };
    this.uploadPicture = props.uploadPicture;
  }

  selectDifferentByType = async (type?: unknown) => {
    const imgApi =
      type === 'camera' ? 'launchCameraAsync' : 'launchImageLibraryAsync';
    const imageResult = await ImagePicker[imgApi]({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (imageResult.canceled) return [];
    else {
      imageResult.assets &&
        imageResult?.assets?.length &&
        imageResult.assets.map(({ uri, type }) => {
          this.uploadPicture(uri, type);
        });
    }
    return imageResult;
  };

  handleSelectImage = async () => {
    try {
      const media_pression =
        await ImagePicker.getMediaLibraryPermissionsAsync();
      if (!media_pression.granted) {
        const requestLibraryPression =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!requestLibraryPression.granted) {
          Toast.show({ title: '暂无权限' });
          return;
        } else {
          this.selectDifferentByType();
        }
      } else {
        this.selectDifferentByType();
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleSelectFile = () => {};
  render() {
    return (
      <HStack p={10} space={50}>
        <VStack alignItems="center">
          <FontAwesome
            name="image"
            size={40}
            color="gray"
            onPress={this.handleSelectImage}
          ></FontAwesome>
          <Center _text={{ fontSize: 12, color: 'gray.400' }}>photo</Center>
        </VStack>
        <VStack alignItems="center">
          <FontAwesome
            name="folder"
            size={40}
            color="gray"
            onPress={this.handleSelectFile}
          ></FontAwesome>
          <Center _text={{ fontSize: 12, color: 'gray.400' }}>folder</Center>
        </VStack>
      </HStack>
    );
  }
}

const styles = StyleSheet.create({});
