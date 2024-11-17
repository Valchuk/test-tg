import type { FC } from 'react';

import { Page } from '@/components/Page.tsx';

import VideoStream from '@/components/VideoStream';

export const IndexPage: FC = () => {
  return (
    <Page back={false}>
        <VideoStream />
    </Page>
  );
};
