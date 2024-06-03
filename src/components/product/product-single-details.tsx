import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import Button from '@components/ui/button';
import Counter from '@components/common/counter';
import { getVariations } from '@framework/utils/get-variations';
import { useCart } from '@store/quick-cart/cart.context';
import usePrice from '@lib/use-price';
import { generateCartItem } from '@utils/generate-cart-item';
import { ProductAttributes } from './product-attributes';
import isEmpty from 'lodash/isEmpty';
import Link from '@components/ui/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useWindowSize } from '@utils/use-window-size';
import Carousel from '@components/ui/carousel/carousel';
import { SwiperSlide } from 'swiper/react';
import { Attachment, Product } from '@type/index';
import isEqual from 'lodash/isEqual';
import VariationPrice from '@components/product/product-variant-price';
import { useTranslation } from 'next-i18next';
import isMatch from 'lodash/isMatch';
import { ROUTES } from '@lib/routes';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import * as fbq from '../../lib/fpixel';
const FavoriteButton = dynamic(
  () => import('@components/product/favorite-button'),
  {
    ssr: false,
  },
);
import { useSanitizeContent } from '@lib/sanitize-content';
import ImageCarousel from './ImageCarousel';
import CheckOutForm from '@components/checkout/CheckOutForm';
import { PlaceOrderAction } from '@components/checkout/action/place-order-action';

const productGalleryCarouselResponsive = {
  '768': {
    slidesPerView: 2,
    spaceBetween: 12,
  },
  '0': {
    slidesPerView: 1,
  },
};

interface Props {
  product: any; // You might want to define a more specific type instead of 'any'
  placeOrderRef: MutableRefObject<null>;
  // Add other props if needed
}

const ProductSingleDetails: React.FC<Props> = ({
  product,
  placeOrderRef,
}: any) => {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const { addItemToCart } = useCart();
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
  const [infos, setInfos] = useState({
    phone: '',
    name: '',
    email: '',
    city: '',
    zip: '',
    address: '',
    deliveryPrice: '',
  });

  const { price, basePrice } = usePrice({
    amount: product?.sale_price ? product?.sale_price : product?.price!,
    baseAmount: product?.price,
  });

  const variations = getVariations(product?.variations!);

  const isSelected = !isEmpty(variations)
    ? !isEmpty(attributes) &&
      Object.keys(variations).every((variation) =>
        attributes.hasOwnProperty(variation),
      )
    : true;

  let selectedVariation: any = {};
  if (isSelected) {
    selectedVariation = product?.variation_options?.find((o: any) =>
      isEqual(
        o.options.map((v: any) => v.value).sort(),
        Object.values(attributes).sort(),
      ),
    );
  }

  function addToCart() {
    if (!isSelected) return;
    // to show btn feedback while product carting
    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
    }, 600);

    const item = generateCartItem(product!, selectedVariation);
    addItemToCart(item, quantity);
    toast(t('add-to-cart'), {
      //@ts-ignore
      type: 'dark',
      progressClassName: 'fancy-progress-bar',
      position: width > 768 ? 'bottom-right' : 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    fbq.event('Add to cart', { item: item, quantity: quantity });
  }

  function handleAttribute(attribute: any) {
    // Reset Quantity
    if (!isMatch(attributes, attribute)) {
      setQuantity(1);
    }

    setAttributes((prev) => ({
      ...prev,
      ...attribute,
    }));
  }

  function handleClearAttribute() {
    setAttributes(() => ({}));
  }

  // Combine image and gallery
  const combineImages = [...product?.gallery, product?.image];
  const variationImage = product.variation_options;
  const content = useSanitizeContent({ description: product?.description });

  return (
    <>
      <div className="flex w-full items-start justify-between space-x-8 rtl:space-x-reverse md:hidden">
        <h2 className="text-heading text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-bold hover:text-black">
          {product?.name}
        </h2>
        <div>
          <FavoriteButton productId={product?.id} />
        </div>
      </div>
      <div className="flex items-center mb-4 md:hidden">
        {!isEmpty(variations) ? (
          <VariationPrice
            selectedVariation={selectedVariation}
            minPrice={product.min_price}
            maxPrice={product.max_price}
          />
        ) : (
          <>
            {Number(product?.sale_price) &&
              Number(product?.sale_price) < Number(product?.price) && (
                <div className=" bg-red-600 px-2 py-1 font-bold text-white rounded-lg ml-2">
                  <div>
                    %{' '}
                    {Math.round(
                      ((Number(product?.price) - Number(product?.sale_price)) /
                        Number(product?.price)) *
                        100,
                    )}
                    -
                  </div>
                </div>
              )}
            <div className="text-base font-semibold text-heading md:text-xl lg:text-2xl">
              {price}
            </div>

            {basePrice && (
              <del className="font-segoe text-gray-400 text-base lg:text-xl ltr:pl-2.5 rtl:pr-2.5 -mt-0.5 md:mt-0">
                {basePrice}
              </del>
            )}
          </>
        )}
      </div>
      <div className="md:grid md:grid-cols-2 gap-8">
        <div>
          <ImageCarousel combineImages={combineImages} />
        </div>

        <div className="pt-8 lg:pt-0">
          <div className="border-b border-gray-300 pb-7">
            <div className="md:flex w-full items-start justify-between space-x-8 rtl:space-x-reverse hidden">
              <h2 className="text-heading text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-bold hover:text-black">
                {product?.name}
              </h2>
              <div>
                <FavoriteButton productId={product?.id} />
              </div>
            </div>
            <div className="md:flex items-center mb-4 hidden">
              {!isEmpty(variations) ? (
                <VariationPrice
                  selectedVariation={selectedVariation}
                  minPrice={product.min_price}
                  maxPrice={product.max_price}
                />
              ) : (
                <>
                  {Number(product?.sale_price) &&
                    Number(product?.sale_price) < Number(product?.price) && (
                      <div className=" bg-red-600 px-2 py-1 font-bold text-white rounded-lg ml-2">
                        <div>
                          %{' '}
                          {Math.round(
                            ((Number(product?.price) -
                              Number(product?.sale_price)) /
                              Number(product?.price)) *
                              100,
                          )}
                          -
                        </div>
                      </div>
                    )}
                  <div className="text-base font-semibold text-heading md:text-xl lg:text-2xl">
                    {price}
                  </div>

                  {basePrice && (
                    <del className="font-segoe text-gray-400 text-base lg:text-xl ltr:pl-2.5 rtl:pr-2.5 -mt-0.5 md:mt-0">
                      {basePrice}
                    </del>
                  )}
                </>
              )}
            </div>
            <div id="placeOrderSection" />
            <CheckOutForm infos={infos} setInfos={setInfos} />

            <div className=" border-b pb-4 border-gray-300 flex gap-2 w-full flex-col-reverse md:flex-row md:items-center">
              <div>
                {isEmpty(variations) && (
                  <>
                    {Number(product.quantity) > 0 ? (
                      <Counter
                        quantity={quantity}
                        onIncrement={() => {
                          setQuantity((prev) => prev + 1);
                          fbq.event('Qunatity increment', {
                            quantity: quantity,
                          });
                        }}
                        onDecrement={() => {
                          setQuantity((prev) => (prev !== 1 ? prev - 1 : 1));
                          fbq.event('Qunatity decrement', {
                            quantity: quantity,
                          });
                        }}
                        disableDecrement={quantity === 1}
                        disableIncrement={Number(product.quantity) === quantity}
                      />
                    ) : (
                      <div className="text-base text-red-500 whitespace-nowrap ltr:lg:ml-7 rtl:lg:mr-7">
                        {t('text-out-stock')}
                      </div>
                    )}
                  </>
                )}

                {!isEmpty(selectedVariation) && (
                  <>
                    {selectedVariation?.is_disable ||
                    selectedVariation.quantity === 0 ? (
                      <div className="text-base text-red-500 whitespace-nowrap ltr:lg:ml-7 rtl:lg:mr-7">
                        {t('text-out-stock')}
                      </div>
                    ) : (
                      <Counter
                        quantity={quantity}
                        onIncrement={() => setQuantity((prev) => prev + 1)}
                        onDecrement={() =>
                          setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
                        }
                        disableDecrement={quantity === 1}
                        disableIncrement={
                          Number(selectedVariation.quantity) === quantity
                        }
                      />
                    )}
                  </>
                )}
              </div>

              <div className="flex-1" ref={placeOrderRef}>
                <PlaceOrderAction
                  product={{ ...product, quantity: quantity }}
                  infos={infos}
                >
                  {t('button-place-order')}
                </PlaceOrderAction>
              </div>
            </div>

            <div className="flex items-center py-8 space-x-4 border-b border-gray-300 rtl:space-x-reverse ltr:md:pr-32 ltr:lg:pr-12 ltr:2xl:pr-32 ltr:3xl:pr-48 rtl:md:pl-32 rtl:lg:pl-12 rtl:2xl:pl-32 rtl:3xl:pl-48">
              <Button
                onClick={addToCart}
                variant="slim"
                className={`w-full md:w-6/12 xl:w-full ${
                  !isSelected && 'bg-gray-400 hover:bg-gray-400'
                }`}
                disabled={
                  !isSelected ||
                  !product?.quantity ||
                  product.status.toLowerCase() != 'publish' ||
                  (!isEmpty(selectedVariation) &&
                    !selectedVariation?.quantity) ||
                  (!isEmpty(selectedVariation) && selectedVariation?.is_disable)
                }
                loading={addToCartLoader}
              >
                <span className="py-2 3xl:px-8">
                  {product?.quantity ||
                  (!isEmpty(selectedVariation) && selectedVariation?.quantity)
                    ? t('text-add-to-cart')
                    : t('text-out-stock')}
                </span>
              </Button>
            </div>
            {content ? (
              <div
                className="text-sm leading-6 text-body lg:text-base lg:leading-8 react-editor-description pt-4"
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
              />
            ) : (
              ''
            )}
          </div>
          {!isEmpty(variations) && (
            <div className="pb-3 border-b border-gray-300 pt-7">
              {Object.keys(variations).map((variation) => {
                return (
                  <ProductAttributes
                    key={variation}
                    title={variation}
                    attributes={variations[variation]}
                    active={attributes[variation]}
                    onClick={handleAttribute}
                    clearAttribute={handleClearAttribute}
                  />
                );
              })}
            </div>
          )}

          <div className="py-6">
            <ul className="pb-1 space-y-5 text-sm">
              {product?.sku && (
                <li>
                  <span className="inline-block font-semibold text-heading ltr:pr-2 rtl:pl-2">
                    SKU:
                  </span>
                  {product?.sku}
                </li>
              )}

              {product?.categories &&
                Array.isArray(product.categories) &&
                product.categories.length > 0 && (
                  <li>
                    <span className="inline-block font-semibold text-heading ltr:pr-2 rtl:pl-2">
                      Category:
                    </span>
                    {product.categories.map((category: any, index: number) => (
                      <Link
                        key={index}
                        href={`${ROUTES.CATEGORY}/${category?.slug}`}
                        className="transition hover:underline hover:text-heading"
                      >
                        {product?.categories?.length === index + 1
                          ? category.name
                          : `${category.name}, `}
                      </Link>
                    ))}
                  </li>
                )}

              {product?.tags &&
                Array.isArray(product.tags) &&
                product.tags.length > 0 && (
                  <li className="productTags">
                    <span className="inline-block font-semibold text-heading ltr:pr-2 rtl:pl-2">
                      Tags:
                    </span>
                    {product.tags.map((tag: any) => (
                      <Link
                        key={tag.id}
                        href={`${ROUTES.COLLECTIONS}/${tag?.slug}`}
                        className="inline-block ltr:pr-1.5 rtl:pl-1.5 transition hover:underline hover:text-heading ltr:last:pr-0 rtl:last:pl-0"
                      >
                        {tag.name}
                        <span className="text-heading">,</span>
                      </Link>
                    ))}
                  </li>
                )}

              <li>
                <span className="inline-block font-semibold text-heading ltr:pr-2 rtl:pl-2">
                  {t('text-brand-colon')}
                </span>
                <Link
                  href={`${ROUTES.BRAND}=${product?.type?.slug}`}
                  className="inline-block ltr:pr-1.5 rtl:pl-1.5 transition hover:underline hover:text-heading ltr:last:pr-0 rtl:last:pl-0"
                >
                  {product?.type?.name}
                </Link>
              </li>

              <li>
                <span className="inline-block font-semibold text-heading ltr:pr-2 rtl:pl-2">
                  {t('text-shop-colon')}
                </span>
                <Link
                  href={`${ROUTES.SHOPS}/${product?.shop?.slug}`}
                  className="inline-block ltr:pr-1.5 rtl:pl-1.5 transition hover:underline hover:text-heading ltr:last:pr-0 rtl:last:pl-0"
                >
                  {product?.shop?.name}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSingleDetails;
