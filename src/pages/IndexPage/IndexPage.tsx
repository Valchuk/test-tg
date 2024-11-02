import type { FC } from 'react';

import { Page } from '@/components/Page.tsx';

import { VideoFrame } from '@/components/VideoFrame/VideoFrame';

export const IndexPage: FC = () => {
  return (
    <Page back={false}>
        <VideoFrame />
    </Page>
  );
};
