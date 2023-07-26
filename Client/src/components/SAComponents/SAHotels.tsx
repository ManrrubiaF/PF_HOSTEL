import { useEffect, useState } from 'react'
import NavSADB from '../NavBar/NavSADB';
import { tokenStore, SAStore } from "../../Store";
import axios from "axios";
import HotelsRow from './SAHotelsRow';



export default function SAHotels() {
    const [hotelByUser, setHotelByUser] = useState<any[]>([])
    const update = SAStore((state) => state.updated)
    const userData = tokenStore((state)=> state.userState)
    const url = import.meta.env.VITE_URL;
    

    const getHotels = async () => {
        try {
            const response = await axios.get(
                `${url}/hotel/admin`,
                {
                    headers: {
                        authorization: `Bearer ${userData[1]}`,
                    },
                }
            )
            if (response.data) {

                setHotelByUser(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getHotels()
    }, [])
    useEffect(() => {
        getHotels()
    }, [update])



    return (
        <div className="flex flex-col h-full mt-2 bg-slate-300 rounded-xl">
            <hr />            
            <NavSADB />
            <div className="flex flex-col h-full overflow-y-auto">
                {hotelByUser?.length > 0 ? (
                    hotelByUser?.map((element: { id: string, name: string, country: string, city: string, photo: string, disabled: boolean }) => (
                        (
                            <div key={element.id}>
                                <HotelsRow
                                    key={element.id}
                                    id={element.id}
                                    name={element.name}
                                    country={element.country}
                                    city={element.city}
                                    photo={element.photo}
                                    disabled={element.disabled}
                                />
                            </div>
                        )
                    ) )
                ) : (
                    <p>No hay hoteles</p>
                ) }
            </div>
        </div>
    );
}
