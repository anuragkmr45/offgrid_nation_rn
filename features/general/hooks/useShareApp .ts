import { Platform, Share } from 'react-native';
import Toast from 'react-native-toast-message';
import { useGetAppDownloadLinksQuery } from '../api/appLinksApi';

const WAIT_MS = 4_000;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const useShareApp = () => {
  const { data, isFetching, refetch } = useGetAppDownloadLinksQuery();

  const share = async () => {
    try {
      // ⬇️  TS infers AppDownloadLinks | undefined automatically
      let links = data?.[0];

      if (!links) {
        const res = await refetch().unwrap();
        links = res?.[0];
      }

      if (!links) {
        await sleep(WAIT_MS);
        const res = await refetch().unwrap();
        links = res?.[0];
      }

      if (!links) {
        Toast.show({
          type: 'error',
          text1: 'Could not fetch the download link. Please try again shortly.',
        });
        return;
      }

      const url = Platform.OS === 'ios' ? links.ios : links.playstore;

      await Share.share({
        message: [
          '🌲  Offgrid keeps you connected to nature and friends—even when you’re off the grid!',
          '',
          `Download for ${Platform.OS === 'ios' ? 'iPhone' : 'Android'}:`,
          url,
        ].join('\n'),
      });
    } catch (err) {
      console.error(err);
      Toast.show({ type: 'error', text1: 'Unable to share app link' });
    }
  };

  return { share, isFetching: isFetching && !data };
};
