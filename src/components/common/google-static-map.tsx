import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useToken } from '@lib/use-token';
import { SUPER_ADMIN } from '@lib/constants';

type Props = {
  lat: number;
  lng: number;
};

const GoogleStaticMap: React.FC<Props> = ({ lat, lng }) => {
  const { t } = useTranslation();
  const { getAuthCredentials, hasAccess } = useToken();
  const { permissions } = getAuthCredentials();
  const isSuperAdmin = hasAccess([SUPER_ADMIN], permissions);
  const GOOGLE_MAP_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!;

  const mapSrc = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&markers=color:red|${lat},${lng}&zoom=12&size=400x200&key=${GOOGLE_MAP_API_KEY}`;

  return GOOGLE_MAP_API_KEY ? (
    <Image
      width={360}
      height={185}
      src={mapSrc}
      alt="Location"
      blurDataURL={mapSrc}
    />
  ) : isSuperAdmin ? (
    <p className="text-red-500">{t('text-no-google-map-key')}</p>
  ) : (
    <></>
  );
};

export default GoogleStaticMap;
