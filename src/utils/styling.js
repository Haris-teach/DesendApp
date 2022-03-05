import {StyleSheet} from 'react-native';

import {colors} from '../constants/colors';

export const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: colors.color_light_grey_white,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: color_white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.color_black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: colors.color_dark_orange,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: colors.color_dark_orange,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  transparenButton: {
    alignItems: 'flex-end',
    backgroundColor: color_transparent,
    color: colors.color_orange,
    padding: 7,
  },
  dropdwonItem: {
    fontSize: 17,
    height: 80,
    color: colors.color_black,
    textAlign: 'justify',
    borderBottomColor: colors.color_black,
  },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },

  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  },
});
