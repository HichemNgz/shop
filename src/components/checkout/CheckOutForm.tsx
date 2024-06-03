import Input from '@components/ui/input';
import React from 'react';
import cities from '../../../delivery.json';
import * as fbq from '../../lib/fpixel'

const CheckOutForm = ({ infos, setInfos }: any) => {
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCityName = e.target.value;
    const selectedCity = cities.find((city) => city.name === selectedCityName);

    if (selectedCity) {
      setInfos({
        ...infos,
        city: selectedCity.name,
        deliveryPrice: selectedCity.price,
      });
    }
  };

  const sendClickEvent = () => {
    fbq.event('Click on form', {})
  }
  return (
    <div onClick={sendClickEvent} className="p-5 bg-white border border-gray-100 rounded-md shadow-checkoutCard md:p-7 flex flex-col gap-4">
      <div className="mb-4">
        <label htmlFor="phone-input" className="block mb-2 text-sm font-medium text-gray-700">
          رقم الهاتف
        </label>
        <Input
          id="phone-input"
          value={infos.phone}
          name="Phone"
          onChange={(e) => setInfos({ ...infos, phone: e.target.value })}
          variant="outline"
          type="number"
          placeholder="رقم الهاتف"
          inputClassName="py-2 px-4 md:px-5 w-full appearance-none border text-input text-xs md:text-[13px] lg:text-sm font-body rounded-md placeholder-body min-h-12 transition duration-200 ease-in-out bg-white border-gray-300 focus:outline-none focus:border-heading h-11 md:h-12"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="name-input" className="block mb-2 text-sm font-medium text-gray-700">
          الاسم الكامل
        </label>
        <Input
          id="name-input"
          value={infos.name}
          name="Name"
          onChange={(e) => setInfos({ ...infos, name: e.target.value })}
          variant="outline"
          placeholder=" الاسم الكامل"
          inputClassName="py-2 px-4 md:px-5 w-full appearance-none border text-input text-xs md:text-[13px] lg:text-sm font-body rounded-md placeholder-body min-h-12 transition duration-200 ease-in-out bg-white border-gray-300 focus:outline-none focus:border-heading h-11 md:h-12"
        />
      </div>

      {/*<div className="mb-4">
        <label htmlFor="email-input" className="block mb-2 text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          id="email-input"
          value={infos.email}
          name="Email"
          onChange={(e) => setInfos({ ...infos, email: e.target.value })}
          variant="outline"
          placeholder="Email"
          inputClassName="py-2 px-4 md:px-5 w-full appearance-none border text-input text-xs md:text-[13px] lg:text-sm font-body rounded-md placeholder-body min-h-12 transition duration-200 ease-in-out bg-white border-gray-300 focus:outline-none focus:border-heading h-11 md:h-12"
        />
  </div>*/}

      <div className="mb-4">
        <label htmlFor="city-select" className="block mb-2 text-sm font-medium text-gray-700">
          الولاية
        </label>
        <select
          id="city-select"
          onChange={handleCityChange}
          className="block w-full p-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="">الولاية</option>
          {cities?.map((city, index) => (
            <option key={index} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>

        {infos?.deliveryPrice ? (
          <div className='flex gap-2 flex-row-reverse text-sm font-semibold italic'>
            <div>سعر التوصيل </div>
            <div>DZD {infos?.deliveryPrice}</div>
          </div>
        ): null}
      </div>

      

      <div className="mb-4">
        <label htmlFor="address-input" className="block mb-2 text-sm font-medium text-gray-700">
          العنوان
        </label>
        <Input
          id="address-input"
          value={infos.address}
          name="Address"
          onChange={(e) => setInfos({ ...infos, address: e.target.value })}
          variant="outline"
          placeholder="العنوان"
          inputClassName="py-2 px-4 md:px-5 w-full appearance-none border text-input text-xs md:text-[13px] lg:text-sm font-body rounded-md placeholder-body min-h-12 transition duration-200 ease-in-out bg-white border-gray-300 focus:outline-none focus:border-heading h-11 md:h-12"
        />
      </div>
    </div>
  );
};

export default CheckOutForm;
