import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCreateOrder } from '@framework/orders';
import { API_ENDPOINTS } from '@framework/utils/endpoints';

import ValidationError from '@components/ui/validation-error';
import Button from '@components/ui/button';
import isEmpty from 'lodash/isEmpty';
import { formatOrderedProduct } from '@lib/format-ordered-product';
import { useCart } from '@store/quick-cart/cart.context';
import { useAtom } from 'jotai';
import { checkoutAtom, discountAtom, walletAtom } from '@store/checkout';
import {
  calculatePaidTotal,
  calculateTotal,
} from '@store/quick-cart/cart.utils';
import { useTranslation } from 'next-i18next';
import { useUser } from '@framework/auth';
// import { useSettings } from "@contexts/settings.context";
import * as fbq from '../../../lib/fpixel';

export const PlaceOrderAction: React.FC<{
  children: React.ReactNode;
  infos: any;
  product?: any;
}> = (props) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { createOrder, isLoading } = useCreateOrder();
  const [placeOrderLoading, setPlaceOrderLoading] = useState(isLoading);
  const { locale }: any = useRouter();
  const { items } = useCart();
  const { me } = useUser();

  const [
    {
      billing_address,
      shipping_address,
      delivery_time,
      coupon,
      verified_response,
      customer_contact,
      customer_name,
      customer_email,
      payment_gateway,
      token,
      note,
    },
  ] = useAtom(checkoutAtom);
  const [discount] = useAtom(discountAtom);
  const [use_wallet_points] = useAtom(walletAtom);

  const available_items = items?.filter(
    (item) => !verified_response?.unavailable_products?.includes(item.id),
  );

  const subtotal = available_items?.length
    ? calculateTotal(available_items)
    : null;
  // const {
  //   settings: { freeShippingAmount, freeShipping },
  // } = useSettings();
  // let freeShippings = freeShipping && Number(freeShippingAmount) <= subtotal;
  const total = calculatePaidTotal(
    {
      totalAmount: subtotal
        ? subtotal
        : props?.product?.sale_price
          ? props?.product?.sale_price * props?.product?.quantity
          : props?.product?.quantity * props?.product?.price,
      tax: 0,
      shipping_charge: props?.infos?.deliveryPrice,
    },
    Number(discount),
  );

  // place order handle function
  const handlePlaceOrder = () => {
    if (
      !props.infos.phone ||
      !props.infos.name ||
      !props.infos.city ||
      !props.infos.address
    ) {
      setErrorMessage('الرجاء إدخال كل معلوماتك الشخصية');
      return;
    }

    fbq.event('Place Order', {
      products: available_items?.length
        ? available_items?.map((item) => formatOrderedProduct(item))
        : [
            {
              order_quantity: props?.product?.quantity,
              product_id: props?.product?.id,
              subtotal: props?.product?.sale_price
                ? props?.product?.sale_price * props?.product?.quantity
                : props?.product?.quantity * props?.product?.price,
              unit_price: props?.product?.sale_price
                ? props?.product?.sale_price
                : props?.product?.price,
            },
          ],
      // status: orderStatusData?.orderStatuses?.data[0]?.id ?? "1",
      amount: subtotal
        ? subtotal
        : props?.product?.sale_price
          ? props?.product?.sale_price * props?.product?.quantity
          : props?.product?.quantity * props?.product?.price,
      coupon_id: Number(coupon?.id),
      discount: discount ?? 0,
      paid_total: total,
      sales_tax: 0,
      delivery_fee: props?.infos?.deliveryPrice,
      total,
      delivery_time: 'No time',

      customer_contact: props.infos?.phone,
      customer_name: props.infos?.name,
      customer_email: 'chicelegantes@gmail.com',
      note: '',
      use_wallet_points: null,
      payment_gateway: 'CASH_ON_DELIVERY',

      billing_address: {
        city: props.infos?.city,
        zip: '00000',
        address: props.infos?.address,
        country: 'Algeria',
        state: 'Algeria',
      },
      shipping_address: {
        city: props.infos?.city,
        zip: '00000',
        address: props.infos?.address,
        country: 'Algeria',
        state: 'Algeria',
      },
    });

    // if (payment_gateway === "STRIPE" && !token) {
    //   setErrorMessage(t("common:text-pay-first"));
    //   return;
    // }
    let input = {
      //@ts-ignore
      products: available_items?.length
        ? available_items?.map((item) => formatOrderedProduct(item))
        : [
            {
              order_quantity: props?.product?.quantity,
              product_id: props?.product?.id,
              subtotal: props?.product?.sale_price
                ? props?.product?.sale_price * props?.product?.quantity
                : props?.product?.quantity * props?.product?.price,
              unit_price: props?.product?.sale_price
                ? props?.product?.sale_price
                : props?.product?.price,
            },
          ],
      // status: orderStatusData?.orderStatuses?.data[0]?.id ?? "1",
      amount: subtotal
        ? subtotal
        : props?.product?.sale_price
          ? props?.product?.sale_price * props?.product?.quantity
          : props?.product?.quantity * props?.product?.price,
      coupon_id: Number(coupon?.id),
      discount: discount ?? 0,
      paid_total: total,
      sales_tax: 0,
      delivery_fee: props?.infos?.deliveryPrice,
      total,
      delivery_time: 'No time',

      customer_contact: props.infos?.phone,
      customer_name: props.infos?.name,
      customer_email: 'chicelegantes@gmail.com',
      note: '',
      use_wallet_points: null,
      payment_gateway: 'CASH_ON_DELIVERY',

      billing_address: {
        city: props.infos?.city,
        zip: '00000',
        address: props.infos?.address,
        country: 'Algeria',
        state: 'Algeria',
      },
      shipping_address: {
        city: props.infos?.city,
        zip: '00000',
        address: props.infos?.address,
        country: 'Algeria',
        state: 'Algeria',
      },
    };
    // if (payment_gateway === "STRIPE") {
    //   //@ts-ignore
    //   input.token = token;
    // }

    createOrder(input);
  };

  const isAllRequiredFieldSelected = [
    props.infos?.phone,
    props.infos?.name,
    props.infos?.city,
    props.infos?.zip,
    props.infos?.address,
  ].every((item) => !isEmpty(item));

  return (
    <div className="px-6">
      <Button
        loading={isLoading}
        className="w-full my-5 glow-button"
        onClick={handlePlaceOrder}
        {...props}
      />
      {errorMessage && (
        <div className="my-3">
          <ValidationError message={errorMessage} />
        </div>
      )}
    </div>
  );
};
