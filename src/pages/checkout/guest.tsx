import { useTranslation } from 'next-i18next';
import {
  billingAddressAtom,
  clearCheckoutAtom,
  shippingAddressAtom,
} from '@store/checkout';
import dynamic from 'next/dynamic';
import { AddressType } from '@framework/utils/constants';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import GuestName from '@components/checkout/guest-name';
import { useSettings } from '@framework/settings';
import Spinner from '@components/ui/loaders/spinner/spinner';
import { useRouter } from 'next/router';
import { getLayout } from '@components/layout/layout';
import { ROUTES } from '@lib/routes';
import CheckOutForm from '@components/checkout/CheckOutForm';

export { getStaticProps } from '@framework/common.ssr';

const ScheduleGrid = dynamic(
  () => import('@components/checkout/schedule/schedule-grid'),
);
const GuestAddressGrid = dynamic(
  () => import('@components/checkout/address-grid-guest'),
);
const ContactGrid = dynamic(
  () => import('@components/checkout/contact/contact-grid'),
);
const RightSideView = dynamic(
  () => import('@components/checkout/right-side-view'),
  { ssr: false },
);
const OrderNote = dynamic(() => import('@components/checkout/order-note'), {
  ssr: false,
});

export default function GuestCheckoutPage() {
  // const { me } = useUser();
  const { t } = useTranslation();
  const [, resetCheckout] = useAtom(clearCheckoutAtom);
  const [billingAddress] = useAtom(billingAddressAtom);
  const [shippingAddress] = useAtom(shippingAddressAtom);
  const [infos, setInfos] = useState({
    phone: '',
    name: '',
    email: '',
    city: '',
    zip: '',
    address: '',
    deliveryPrice: "",
  });
  const router = useRouter();
  const { data, isLoading } = useSettings();
  const settings = data?.options!;
  const { guestCheckout } = settings;
  useEffect(() => {
    //@ts-ignore
    resetCheckout();
    if (!isLoading && !guestCheckout) {
      router.replace(ROUTES.HOME);
    }
  }, [resetCheckout, settings]);

  if (isLoading) {
    return <Spinner showText={false} />;
  }

  return (
    guestCheckout && (
      <>
        {/* < noindex={true} nofollow={true} /> */}
        <div className="bg-gray-100 px-4 py-8 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20">
          <div className="m-auto flex w-full max-w-5xl flex-col items-center rtl:space-x-reverse lg:flex-row lg:items-start lg:space-x-8">
            <div className="w-full space-y-6 lg:max-w-[600px]">
              <CheckOutForm infos={infos} setInfos={setInfos} />
            </div>

            <div className="w-full lg:w-[320px] xl:w-[440px] flex-shrink-0 mt-10 sm:mt-12 lg:mt-0">
              <RightSideView infos={infos}/>
            </div>
          </div>
        </div>
      </>
    )
  );
}
GuestCheckoutPage.getLayout = getLayout;
