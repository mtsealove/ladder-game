import Document, {
  Head, Html, Main, NextScript,
} from 'next/document';

class CustomDocument extends Document {
  render(): JSX.Element {
    return (
            <Html>
                <Head>
                    <link rel='preload' as='font' href='/fonts/Pretendard-Light.subset.woff2' type='font/woff2' crossOrigin='anonymous'/>
                    <link rel='preload' as='font' href='/fonts/Pretendard-Regular.subset.woff2' type='font/woff2' crossOrigin='anonymous'/>
                    <link rel='preload' as='font' href='/fonts/Pretendard-Medium.subset.woff2' type='font/woff2' crossOrigin='anonymous'/>
                    <link rel='preload' as='font' href='/fonts/Pretendard-SemiBold.subset.woff2' type='font/woff2' crossOrigin='anonymous'/>
                    <link rel='preload' as='font' href='/fonts/Pretendard-Bold.subset.woff2' type='font/woff2' crossOrigin='anonymous'/>
                </Head>
                <body>
                <Main />
                <NextScript />
                </body>
            </Html>
    );
  }
}

export default CustomDocument;
