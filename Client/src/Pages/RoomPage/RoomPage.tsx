import { useParams, useNavigate } from "react-router-dom";
import { roomsStore } from "../../Store";
import { useEffect, useState } from "react";
import { setRoomDetail, useFetchRooms } from "../../hooks";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import NavbarDetail from "../../components/NavBarDetail/NavBarDetail";
import Footer from "../../components/Footer/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { tokenStore } from "../../Store";
import { string } from "yup";
import { userStore } from "../../Store/UserStore";
import {
  reserveErrorToast,
  reserveSuccessToast,
  reserveFullToast,
  filterResetToast,
  invalidDatesToast,
} from "../../components/toast";
import { toast } from "react-hot-toast";

export interface ReserveBooking {
  roomId: string;
  checkin: string;
  checkout: string;
 
  price: string;
}

const RoomPage = () => {
  const { id } = useParams();
  const { setRoom } = roomsStore();
  const [roomRender, setRoomRender] = useState();
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [date, setDate] = useState({ in: "", out: "" });
  const [reserve, setReserve] = useState<ReserveBooking[] | null>(null);
  const token = tokenStore((state) => state.userState);
  const room = roomsStore((state) => state.rooms);
  const { reserveRoomPayment } = userStore();
  const userReserve = userStore((state) => state.reserves);
  const navigate = useNavigate()

  useFetchRooms();
  const allRooms = roomsStore((state) => state.rooms);


  useEffect(() => {
    const roomOnScreen = allRooms.find((roomRender) => {
      if (typeof roomRender.id === "number") {
        return roomRender.id === Number(id);
      } else {
        return roomRender.id === id;
      }
    });
    setRoomRender(roomOnScreen);
    setRoom(id);
  }, [allRooms, id, setRoom]);

  const images = roomRender?.photo.map((url) => ({
    original: url,
    thumbnail: url,
  }));

  const handleArrivalDateChange = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Se agrega 1 al mes ya que los meses en JavaScript van de 0 a 11
    const day = date.getDate().toString().padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    setArrivalDate(date);
    setDate((state) => ({ ...state, in: formattedDate }));
  };

  const handleDepartureDateChange = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Se agrega 1 al mes ya que los meses en JavaScript van de 0 a 11
    const day = date.getDate().toString().padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    setDepartureDate(date);
    setDate((state) => ({ ...state, out: formattedDate }));
  };

  const calculateDays = (item) => {
    const checkinDate = new Date(item.checkin);
    const checkoutDate = new Date(item.checkout);

    // Calcular la diferencia en milisegundos entre las fechas
    const differenceInMs = checkoutDate.getTime() - checkinDate.getTime();

    // Convertir la diferencia en dÃ­as
    const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

   return differenceInDays
  };


  const handleReserve = () => {
    if(arrivalDate.length === 0 || departureDate?.length === 0) {
      invalidDatesToast("Please select valid dates")
      return
    }
    if (userReserve.length === 4) {
      reserveFullToast("4 reservas máximas");
      return false;
    }

    if(!token.length){
      navigate('/login')
      return
    }

    const newReserve: ReserveBooking = {
      roomId: id,
      checkin: date.in,
      checkout: date.out,     
      price: roomRender.price,
    };

  if(calculateDays(newReserve)<1){
  
        reserveErrorToast("Establezca al menos una noche");
       return
  }   

    setReserve([newReserve]);


//Arreglar poder reservare la misma habitacion en distinta fecha
    for (let i = 0; i < userReserve.length; i++) {
      if (userReserve[i].roomId === newReserve.roomId) {
        console.log("esta room ya tiene una reserva activa");

        reserveErrorToast("esta room ya tiene una reserva activa");
        return;
      }
    }

    reserveRoomPayment([...userReserve, newReserve]);
    reserveSuccessToast("Habitacion Reservada");
  
    
  };
  console.log(userReserve);
 

  return (
    <div>
      <NavbarDetail />
      <div className="border-2 bg-white p-4 rounded-lg h-screen flex justify-end items-center">
        <div className="flex flex-col items-center">
          <div className="flex flex-col md:flex-row  ">
            <div className="md:w-[900px] mb-2 md:justify-center md:items-center">
              {roomRender?.photo && (
                <div className="w-full h-auto">
                  <h1 className="text-2xl font-bold mb-4">
                    Habitación: {roomRender?.name}
                  </h1>
                  <ImageGallery
                    items={images}
                    className="w-full h-full object-cover"
                  />
                  <div className="flex justify-start mt-2">
                    <div>
                      <DatePicker
                        selected={arrivalDate}
                        onChange={handleArrivalDateChange}
                        placeholderText="Fecha de llegada"
                        className="border-2 rounded-lg px-4 py-2 mr-2"
                      />
                      <DatePicker
                        selected={departureDate}
                        onChange={handleDepartureDateChange}
                        placeholderText="Fecha de salida"
                        className="border-2 rounded-lg px-4 py-2"
                      />
                    </div>

                    <h2 className="text-lg text-[25px] font-bold ml-2">
                      Precio: $ {roomRender?.price}
                    </h2>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                      onClick={handleReserve}
                    >
                      Reservar
                    </button>
                  </div>
                  <p className="mt-4">{roomRender?.description}</p>
                </div>
              )}
            </div>
            <div className="md:w-[400px] md:ml-4">
              <h2 className="text-lg font-bold mt-[40px] mb-2">Servicios:</h2>
              <ul className="list-disc list-inside mb-4 ml-4">
                {roomRender?.services.map((service) => (
                  <li key={service}>{service}</li>

                ))}
              </ul>
              <button onClick={() => navigate(-1)} className="bg-blue-500 font-bold w-[80px] border-black rounded">Back</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};


export default RoomPage;
