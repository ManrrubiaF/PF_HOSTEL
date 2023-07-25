import { useEffect, useState } from 'react';
import { DashStore, tokenStore } from '../../Store';
import axios from 'axios';
import NavBarDashboard1 from './NavBarDashboard1';
import DashboardPapeleraRow from './DashboardRow';
import { userDeleteToast } from '../toast';

const DashboardPapelera = () => {
    const { getHotelByUser } = tokenStore()
    const token = tokenStore((state) => state.userState)
    const url = import.meta.env.VITE_URL;
    const update = DashStore((state) => state.updated)
    const { setUpdated } = DashStore();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const userData = tokenStore((state) => state.userState);


    const [hotelByUser, setHotelByUser] = useState<any[]>([])

    const getHotels = async () => {
        try {
            const response = await axios.get(
                `${url}/dashboard?includeDeletedHotel=true`,
                {
                    headers:
                    {
                        authorization:
                            `Bearer ${token[1]}`,
                    },
                },
            )
            if (response.data) {

                setHotelByUser(response.data);
                getHotelByUser(response.data);
            }
        } catch (error) {
            console.log(error);

        }
    }

    const confirmPermanentDelete = async (id) => {
        try {
            const data = await axios.delete(
                `${url}/dashboard/hotel/${id}?force=true`,
                {
                    headers: {
                        authorization: `Bearer ${userData[1]}`,
                    },
                }
            );
            console.log(data);
            console.log("Hotel eliminado");

            userDeleteToast('Hotel eliminado');

            setUpdated(true);

            setShowConfirmDialog(false);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        getHotels()
    }, [])

    console.log(hotelByUser); // borrar

    return (
        <div className="flex flex-col h-full mt-2 bg-slate-300 rounded-xl">
        <hr />
        <NavBarDashboard1 />
        <div className="flex flex-col h-full overflow-y-auto">
            {hotelByUser?.length > 0 ? (
                hotelByUser?.map((element: { id: string, name: string, country: string, city: string, photo: string, disabled: boolean, destroyTime: string | null }) => {
                    if(!element.disabled && !element.destroyTime) return null
                    return (
                        <div>
                            <DashboardPapeleraRow
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
                } )
            ) : (
            <p>No hay hoteles</p>
            ) }
        </div>
    </div>
    );
};

export default DashboardPapelera;