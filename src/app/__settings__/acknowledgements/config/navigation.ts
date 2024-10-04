import { CommonActions } from '@react-navigation/native';

export const ACKNOWLEDGEMENTS_SCREEN_NAME = "ACKNOWLEDGEMENTS_SCREEN_NAME";

export const goToAcknowledgements = () =>
  CommonActions.navigate({
    name: ACKNOWLEDGEMENTS_SCREEN_NAME,
  });
