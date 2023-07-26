import { useEffect, useState } from 'react';
import { DashStore, tokenStore } from '../../Store';
import axios from 'axios';
import DashboardPapeleraRow from './DashboardPapeleraRow';
import NavBarDashboardPapelera from './NavBarDashboardPapelera';

const DashboardPapelera = () => {
    const { getHotelByUser } = tokenStore()
    const token = tokenStore((state) => state.userState)
    const url = import.meta.env.VITE_URL;
    const userData = tokenStore((state) => state.userState);
    const update = DashStore((state) => state.updated)


    const [hotelsForDeleted, setHotelsForDeleted] = useState<any[]>([])
    console.log(userData);
    
    const getHotelsBin = async () => {
        try {
            const response = await axios.get(
                `${url}/hotel/hotelsBin`,
                {
                    headers:
                    {
                        authorization:
                            `Bearer ${token[1]}`,
                    },
                },
            )
            if (response.data) {
                setHotelsForDeleted(response.data);
                getHotelByUser(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getHotelsBin()
    }, [])

    useEffect(() => {
        getHotelsBin()
    }, [update])

    return (
        <div className="flex flex-col h-full mt-2 bg-slate-300 rounded-xl">
            <hr />
            <NavBarDashboardPapelera />
            <div className="flex flex-col h-full overflow-y-auto">
                {hotelsForDeleted?.length > 0 ? (
                    hotelsForDeleted?.map((element: { id: string, name: string, country: string, city: string, photo: string, destroyTime: string | null }) => {
                        if (!element.destroyTime) return null
                        return (
                            <div>
                                <DashboardPapeleraRow
                                    key={element.id}
                                    id={element.id}
                                    name={element.name}
                                    country={element.country}
                                    city={element.city}
                                    photo={element.photo}
                                />
                            </div>
                        )
                    })
                ) : (
                    <p>No hay hoteles</p>
                )}
            </div>
        </div>
    );
};

export default DashboardPapelera;