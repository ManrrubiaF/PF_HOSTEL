import axios from "axios";
import { create } from "zustand";
import { ReserveBooking } from "../Pages/RoomPage/RoomPage";
import { array } from "yup";
const url = import.meta.env.VITE_URL;

type States = {
  reserves: ReserveBooking[];
  urlPayment: string | null;
  sessionIdUser: string;
};

type Actions = {
  reserveRoomPayment: (data: []) => Promise<void>;
  roomPayment: (data: object) => Promise<void>;
  deleteAccount: (userId: string) => Promise<void>

  reset: () => void;
};

const initialState: States = {
  reserves: [],
  urlPayment: null,
  sessionIdUser: ""
};

export const userStore = create<States & Actions>((set) => ({
  ...initialState,

  reserveRoomPayment: async (data) => {
    try {
      set((state) => ({ ...state, reserves: data }));
    } catch (error) {
      console.log(error);
    }
  },

  reset: () => {
    set(initialState);
  },

  roomPayment: async (info:[], token:string) => {
    try {
      const { data } = await axios.post(
        `${url}/booking/reserva`,
        info,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      const urlPago = data.urlpago; // Ajusta esto según la estructura de la respuesta del backend
      console.log(data);
       
      set((state) => ({
		...state,
		urlPayment: urlPago,
    sessionIdUser: data.sessionId
	}));
    } catch (error) {
      console.log(error);
    }
  },
}));
