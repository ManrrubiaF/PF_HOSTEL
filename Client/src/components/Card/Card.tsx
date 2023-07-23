import { Buildings } from "@phosphor-icons/react";
import axios from "axios";
import { hotelStore, tokenStore } from "../../Store";
import { useEffect, useState } from "react";
import { Hotel } from "../../models";
import { Link } from "react-router-dom";
import { userStore } from "../../Store/UserStore";
import { favoriteStore } from "../../Store/FavoriteStore";
const url = import.meta.env.VITE_URL;

interface CardProps {
  id: string;
  name: string;
  description: string;
  country: string;
  city: string;
  photo: string[];
  services: string[];
  hotelCategory: string;
  score: number;
}

const Card: React.FC<Hotel> = ({
  id,
  name,
  description,
  country,
  city,
  photo,
  hotelCategory,
  services
}) => {

  const hotelFavorite = userStore((state)=>state.favoriteHotel)
  const hotels = hotelStore((state)=>state.hotels)
  const {  addFavorite } = userStore();
  const {  setHotelFavorites} = favoriteStore();
  const token = tokenStore((state)=>state.userState)
  const {favorites} = favoriteStore(state=>state)


  const renderStars = (rating: number) => {
    const filledStars = rating;
    const emptyStars = 5 - rating;

    const stars = [];

    for (let i = 0; i < filledStars; i++) {
      stars.push(
        <span key={`filled-star-${i}`} className="text-yellow-500">
          ★
        </span>
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-star-${i}`} className="text-gray-300">
          ★
        </span>
      );
    }

    return stars;
  };


  const renderIcon = (score: number) => {
    const icons = [];

    for (let i = 0; i < score; i++) {
      icons.push(<Buildings key={`building-${i}`} size={32} color='darkblue' />);
    }

    return icons;
  };
   

  


 

 const isFav = hotelFavorite.some((favHotel:any) => favHotel == id);

  const handleFavorite = async () => {
   
    const info ={
      hotelId: id
    }

      await addFavorite(info, token[1]);
     
     
  };

 
 
useEffect(()=>{
const hotelFavorites = hotels.filter(hotel=> hotelFavorite.includes(hotel.id))

   setHotelFavorites(hotelFavorites)
    
}, [hotelFavorite])
  
  


  const [ratingValue, setRatingValue] = useState<number | null>(null);
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await axios.get(`${url}/rating/${id}`);
        const scores = response.data.map((element:any) => element.score);
        const sum = scores.reduce((acc:any, score:any) => acc + score, 0);
        const average = Math.round(sum / scores.length);
        setRatingValue(average);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRating();
  }, [id]);

  const orderedServices = () => {
    const stringRaw = services.join(', ');
    return stringRaw    
  }

  return (
  
    <div className="bg-white h-[460px] max-w-5xl rounded-md shadow-md flex mx-auto transform hover:scale-105 transition duration-300">
  
        <img
        src={photo}
        alt={name}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src =
            "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";
        }}
        className="w-1/3 h-full object-cover rounded-l-md"
      />
     
      <div className="w-2/3 p-4 flex flex-col justify-between">
        <div className="h-full flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-1">{name}</h2>
            <p className="text-gray-600 text-sm overflow-hidden overflow-ellipsis">
              {description}
            </p>
          </div>
          <div>
            Servicios: {orderedServices()}
          </div>
          <div>
            <div className='flex'>
            <p>Categoria: </p>
              {renderStars(Number(hotelCategory))}
            </div>
            <div className='flex'>
              <p>Calificación popular:</p>
              {/* Renderizar el icono de Phosphor repetidamente */}
              {ratingValue !== null && renderIcon(ratingValue)}
            </div>
          </div>
          <div className="flex justify-end">
       <div><button className=" py-2 px-4" onClick={handleFavorite}>{isFav? "💙" : "🤍"}</button></div>
          
          <Link to={`/hotelpage/${id}`} key={id}>
            <div>
              <p className="text-gray-500 mt-1 text-sm">
              Ubicación: {city}, {country}
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Ver habitaciones
            </button>
            </div>
          
           </Link>
        </div> 
          </div>
      </div>
    </div>  
  );
};

export default Card;
