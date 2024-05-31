import { formatOrderedProduct } from "@lib/format-ordered-product";
import { useState } from "react";
import ValidationError from "@components/ui/validation-error";
import { useVerifyCheckout } from "@framework/checkout";
import { useAtom } from "jotai";
import {
  billingAddressAtom,
  shippingAddressAtom,
  verifiedResponseAtom,
} from "@store/checkout";
import Button from "@components/ui/button";
import { useCart } from "@store/quick-cart/cart.context";
import { useTranslation } from "next-i18next";

export const CheckAvailabilityAction: React.FC<{
  className?: string;
  children?: React.ReactNode;
  infos?: any;
}> = (props) => {
  const { t } = useTranslation("common");
  const [billing_address] = useAtom(billingAddressAtom);
  const [shipping_address] = useAtom(shippingAddressAtom);
  const [_, setVerifiedResponse] = useAtom(verifiedResponseAtom);

  const [errorMessage, setError] = useState("");
  const { items, total, isEmpty } = useCart();
  

  const {
    mutate: verifyCheckout,
    isLoading: loading,
  } = useVerifyCheckout();

  function handleVerifyCheckout() {
    
      verifyCheckout(
        {
          amount: total,
          products: items?.map((item) => formatOrderedProduct(item)),
          billing_address: {
            city: props.infos?.city,
            zip: props.infos?.zip,
            address: props.infos?.address,
            country: "Algeria",
            state: "Algeria"
          },
          shipping_address: {
            city: props.infos?.city,
            zip: props.infos?.zip,
            address: props.infos?.address,
            country: "Algeria",
            state: "Algeria"
          },
        },
        {
          onSuccess: (data:any) => {
            setVerifiedResponse(data);
          },
          onError: (error: any) => {
            setError(error?.response?.data?.message);
          },
        }
      );
    
  }

  return (
    <>
      <Button
        loading={loading}
        className="w-full"
        onClick={handleVerifyCheckout}
        disabled={isEmpty}
        {...props}
      />
      {errorMessage && (
        <div className="mt-3">
          <ValidationError message={t(errorMessage)} />
        </div>
      )}
    </>
  );
};
