import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
} from "next/document";
import { getDirection } from "@utils/get-direction";
import { FB_PIXEL_ID } from "../lib/fpixel";

export default class CustomDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		return await Document.getInitialProps(ctx);
	}
	render() {
		const { locale } = this.props.__NEXT_DATA__;
		return (
      <Html dir={getDirection(locale)}>
        <Head>
		<noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
			<link rel="icon" type="image/x-icon" href="/assets/images/logo-chic.png"/>
		</Head>
        <body>
        <Main />
        <NextScript />
        </body>
      </Html>
		);
	}
}
