import { create } from 'zustand';
import {ReactNode} from 'react'



type States = {
    userState: any[];
    hotelsUserById: any[];
}

type Actions = {
    saveInfo: (arrayAux:any) => Promise<void>
    getHotelByUser: (hotelsArray:any) => Promise<void>
    resetToken: () => void
}

const initialState: States = {
    userState: [],
    hotelsUserById: []
}

export const tokenStore = create<States & Actions>((set) => ({
    ...initialState,

    saveInfo: async(arrayAux) => {
        set(() => ({
            userState: arrayAux
        }))
    },

    getHotelByUser: async(hotelsArray:any) => {
        set(() => ({
            hotelsUserById: hotelsArray
        }))
    },

    resetToken: () => {
		set(initialState);
	},
    
}))