import React from 'react';
import { Dimensions, StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';
import Icon from '../components/Icon';
import {
  WHITE_BG_COLOR,
  BLACK_TEXT_COLOR,
  BORDER_COLOR,
  SHADOW_COLOR,
  BLUE_COLOR,
} from './colors';
import { HEADER_FONT_FAMILY } from './typography';

// Window dimensions
export const { width: W_WIDTH, height: W_HEIGHT } = Dimensions.get('window');

// General margins
export const MIN_MARGIN_X = 5;
export const MIN_MARGIN_Y = 10;
export const MARGIN_X = 15;
export const MARGIN_Y = 20;
export const MAX_MARGIN_X = 25;
export const MAX_MARGIN_Y = 30;

// Minimum distance from a window edge and a UI element
export const W_MARGIN = 20;

// Paddings
export const MIN_PADDING_X = 10;
export const MIN_PADDING_Y = 10;
export const PADDING_X = 15;
export const PADDING_Y = 15;

// Shadows
export const SHADOW = {
  shadowColor: SHADOW_COLOR.toString(),
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.5,
  shadowRadius: 2,
};

export const SHADOW_2 = {
  shadowColor: SHADOW_COLOR.lighten(-20),
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5,
  shadowRadius: 1.5,
};

export const SHADOW_3 = {
  shadowColor: SHADOW_COLOR.toString(),
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.4,
  shadowRadius: 1,
};

export const SHADOW_HEAVY = {
  shadowColor: SHADOW_COLOR.toString(),
  shadowOffset: { width: 3, height: 3 },
  shadowOpacity: 0.9,
  shadowRadius: 10,
};

if (Platform.OS === 'android') {
  SHADOW.elevation = 3;
  SHADOW_2.elevation = 3;
}

// Main Element Styles
export const STATUS_BAR_HEIGHT = Constants.statusBarHeight;
export const HEADER_HEIGHT = 60;
export const BOTTOM_TAB_HEIGHT = 50;
export const FORM_INPUT_HEIGHT = 80;

export const WHITE_CONTAINER_WITH_BOTTOM_BORDER_STYLES = {
  ...SHADOW,
  backgroundColor: WHITE_BG_COLOR.toString(),
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: BORDER_COLOR.toString(),
};

// Header Styles for Stack Navigators
export const HEADER_PROPS = {
  headerBackImage: <Icon name='back' size={25} color={BLUE_COLOR.toString()} />,
  headerStyle: {
    ...WHITE_CONTAINER_WITH_BOTTOM_BORDER_STYLES,
    height: HEADER_HEIGHT,
  },
  headerTitleStyle: {
    fontFamily: HEADER_FONT_FAMILY,
    fontWeight: '700',
    fontSize: 18,
    color: BLACK_TEXT_COLOR.toString(),
  },
  headerBackTitle: null,
  headerLeftContainerStyle: {
    paddingLeft: W_MARGIN,
    paddingRight: MIN_MARGIN_X,
  },
  headerRightContainerStyle: {
    paddingLeft: MIN_MARGIN_X,
    paddingRight: W_MARGIN,
  },
  headerTintColor: BLUE_COLOR.toString(),
  gesturesEnabled: true,
};
