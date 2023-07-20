import React, { useState } from "react";
import { Dropdown, Button } from "@rewind-ui/core";
import {
  CurrencyDollar,
  Money,
  ShoppingCart,
  Trash,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../Store/UserStore";
import { roomsStore } from "../../Store/RoomsStores";
import { tokenStore } from "../../Store";


interface Reservation {
  roomId: string;
  checkin: string;
  checkout: string;
  price: number;
  // Añade otras propiedades de la reserva si es necesario
}

const CartComponent: React.FC = () => {
  const navigate = useNavigate();
  const userReserve = userStore((state) => state.reserves);
  const allRooms = roomsStore((state) => state.rooms);
  const token = tokenStore((state) => state.userState);

  const calculateDays = (item: Reservation) => {
    // Convertir las fechas a objetos Date
    const checkinDate = new Date(item.checkin);
    const checkoutDate = new Date(item.checkout);

    // Calcular la diferencia en milisegundos entre las fechas
    const differenceInMs = checkoutDate.getTime() - checkinDate.getTime();

    // Convertir la diferencia en dÃ­as
    const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

    return differenceInDays;
  };

  const { reserveRoomPayment, roomPayment } = userStore();

  const [cartItems, setCartItems] = useState<Reservation[]>(userReserve);

  const handleDeleteItem = ( roomId: string) => {
    
    const newArray: Reservation[] = cartItems.filter((element) => element.roomId !== roomId);

    reserveRoomPayment(newArray);
    setCartItems(newArray);
  };

  const calculateTotalPay = () => {
    const totales = userReserve.map((element) => {
      return element.price * calculateDays(element);
    });

    const sum = totales.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    return sum;
  };

  const roomPhoto = (item: Reservation) => {
    for (let i = 0; i < allRooms.length; i++) {
      if (allRooms[i].id === item.roomId) {
        return allRooms[i].photo[0];
      }
    }
  };

  const roomName = (item: Reservation) => {
    for (let i = 0; i < allRooms.length; i++) {
      if (allRooms[i].id === item.roomId) {
        return (
          <div>
            <p>{allRooms[i].name}</p>
            <p>
              checkin:{item.checkin}
              checkout:{item.checkout}
            </p>
          </div>
        );
      }
    }
  };

  const handleCheckout = async () => {
    if (userReserve.length === 0) {
      return alert('Agregar habitación');
    }

    const data = {
      roomsToReserve: userReserve
    };

    await roomPayment(data, token[1]);

    // Redireccionar a la URL externa en una nueva pestaña
    navigate('/paymenttransition');

    //  reset() //esta linea resetea el estado global del carrito porque la app aún no tiene respuesta del pago
  };

  return (
    <div>
      <Dropdown
        itemColor="red"
        radius="none"
        shadow="sm"
        size="lg"
        outsidePress={false}
        trigger="hover"
        tone="light"
        withChevron={false}
      >
        <Dropdown.Trigger className="flex items-center">
          <Button>
            <ShoppingCart size={30} weight="duotone" className="mr-1.5" />
            Cart ({
              userReserve.length
            })
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Content className="rounded" >
          <Dropdown.Divider />

          <div>
            {userReserve.map((item: Reservation) => (
              <Dropdown.Item className="my-2 justify-center items-center text-center">
                <Button
                  onClick={() => handleDeleteItem(item.roomId)}
                  className="w-[80px]"
                  variant="danger"
                >
                  <Trash size={25} weight="duotone" className="mr-1.5" />
                </Button>
                <div className="flex">
                  <div className="w-[100px] h-[100px] flex justify-center items-center text-center">
                    <img src={roomPhoto(item)} alt="" />
                  </div>
                  <div className="flex flex-col ml-2">
                    <div>{roomName(item)}</div>
                    <p>Dias: {calculateDays(item)}</p>
                    <p>Precio: ${item.price * calculateDays(item)}</p>
                  </div>
                </div>
              </Dropdown.Item>
            ))}
          </div>

          <Dropdown.Divider color="slate" />

          <Dropdown.Divider color="dark" />

          <Dropdown.Label
            className="flex justify-start items-center"
            weight="bold"
          >
            <div className="text-black">Total:</div>
            <span className="ml-20 flex justify-end items-center text-green-500">
              <CurrencyDollar size={21} weight="duotone" />
            </span>
            <div>
              {calculateTotalPay()}
            </div>
          </Dropdown.Label>
          <Dropdown.Divider />
          <Dropdown.Item
            onClick={handleCheckout}
            color="green"
            className="flex justify-center items-center"
          >
            <Money size={20} weight="duotone" className="mr-1.5" />
            Checkout
          </Dropdown.Item>
          <Dropdown.Divider />

          <Dropdown.Item
            onClick={() => navigate("/shoppingcart")}
            className="flex justify-center items-center"
          >
            <ShoppingCart size={20} weight="duotone" className="mr-1.5" />
            View cart
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
};

export default CartComponent;
