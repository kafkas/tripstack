import { StyleSheet } from 'react-native';
import { W_MARGIN, W_WIDTH } from '../../styles';
import { INACTIVE_TEXT_COLOR } from '../../styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  listEmptyContainer: {
    paddingHorizontal: W_MARGIN,
    paddingTop: W_MARGIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listEmptyText: {
    color: INACTIVE_TEXT_COLOR.toString(),
    textAlign: 'center',
  },
  listHeaderContainer: {
    width: W_WIDTH,
    padding: W_MARGIN,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listHeaderText: {
    color: INACTIVE_TEXT_COLOR.toString(),
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
