import { Person } from '@phosphor-icons/react';



interface RoomCardProps {
  id: string;
  name: string;
  description: string;
  price: string
  pax: number;
  services: string;
  photo: string[];
  floorNumber: string;
  disabled: boolean;
  hotelCategory: string;
}


const RoomCard: React.FC<RoomCardProps> = ({
  name,
  price,
  pax,
  services,
  photo,
  disabled,
  hotelCategory
}) => {
  const mainPhoto = Array.isArray(photo) &&  photo[0] || 'https://image.ondacero.es/clipping/cmsimages02/2021/09/20/B48108F9-45F3-417A-833D-259BC2CFA304/69.jpg?crop=2400,1350,x0,y0&width=1280&height=720&optimize=low' ;
  return (
    <div className="bg-white border-2 w-[300px] h-[450px] relative flex flex-col justify-end rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
      <div className="w-full h-[60%] rounded-t-lg overflow-hidden">
        <div className="image-gallery inline-block">
          <img src={mainPhoto} alt="Foto de la habitación" className="w-full h-full object-cover" style={{ objectFit: 'cover' }} />
        </div>
      </div>

      <div className="p-[15px]">
        
        <h2 className="text-[20px] font-bold h-[55px] overflow-hidden">{name}</h2>

        <div className="mb-[10px]">
          <p className="mb-[10px]">Servicios: {services}</p>
          <div className="flex items-center">
            <p className="mb-0 text-green-400 font-bold">{disabled ? "No disponible" : "Disponible"}</p>

          </div>
          <h2 className="font-bold text-md">Categoría: {hotelCategory}</h2>
        </div>

        <div className="flex justify-end">
          <div className="text-right">
            <h2 className="font-bold text-lg">Precio: $ {price}</h2>
          </div>

          <div className="flex items-center ml-[125px]">
            <Person size={20} color="#317ba0" weight="fill" />
            <p className="mb-0">{pax}</p>
          </div>
        </div>
      </div>
    </div>
  );





}

export default RoomCard;