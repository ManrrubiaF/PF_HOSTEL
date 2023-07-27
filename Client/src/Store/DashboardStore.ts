import { create } from 'zustand';

type States = {
    hotels: boolean;
    deletedHotels: boolean;
    deletedRooms: boolean;
    reserves: boolean;
    coments: boolean;
    updated: boolean;
};

type Actions = {
    setHotels: (boolean: boolean) => void;
    setReservs: (boolean: boolean) => void;
    setComents: (boolean: boolean) => void;
    setUpdated: (boolean: boolean) => void;
    setDelete: (boolean: boolean) => void;
    setDeleteRooms: (boolean: boolean) => void;
};

const initialState: States = {
    hotels: true,
    deletedHotels: false,
    deletedRooms:false,
    reserves: false,
    coments: false,
    updated: false,
};

export const DashStore = create<States & Actions>((set) => ({
    ...initialState,
    setHotels: (boolean) => {
        set((state) => ({
            ...state,
            hotels: boolean,
        }))
    },
    setDelete: (boolean) => {
        set((state) => ({
            ...state,
            deletedHotels: boolean,
        }))
    },
    setDeleteRooms: (boolean) => {
        set((state) => ({
            ...state,
            deletedRooms: boolean
        }))
    },
    setReservs: (boolean) => {
        set((state) => ({
            ...state,
            reserves: boolean,
        }))
    },
    setComents: (boolean) => {
        set((state) => ({
            ...state,
            coments: boolean,
        }))
    },
    setUpdated: (boolean) => {
        set((state) => ({
            ...state,
            updated: boolean,
        }))
    }
}))