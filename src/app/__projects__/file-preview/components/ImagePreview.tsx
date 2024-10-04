import React from 'react';
import { Dimensions, Image } from "react-native";
import ImageZoom from 'react-native-image-pan-zoom';
const ImagePreview = ({content}) => {

  const {width, height} = Dimensions.get('window');

  return(
    <ImageZoom
      cropWidth={width}
      cropHeight={height}
      imageWidth={width}
      imageHeight={height}
    >
      <Image
      style={{
        width,
        height,
        resizeMode: 'center', 
      }} 
      source={{uri: content}}/>
    </ImageZoom>
   
  )
}

export default ImagePreview;