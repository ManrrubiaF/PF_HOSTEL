import { useEffect, useState } from "react";
import { DashStore, tokenStore } from "../../Store";
import axios from "axios";
import DashboardPapeleraRowRooms from "./DashboardPapeleraRowRooms";
const url = import.meta.env.VITE_URL;

const DashboardPapeleraRooms = () => {
    const token = tokenStore((state) => state.userState);
    const update = DashStore((state) => state.updated)

    const [roomsForDeleted, setRoomsForDeleted] = useState<any[]>([])
    const [deletedRooms, setDeletedRooms] = useState<any[]>([]);

    const roomsBin = async () => {
        try {
            const response = await axios.get(
                `${url}/room/RoomsBin`,
                {
                    headers: {
                        authorization: `Bearer ${token[1]}`
                    },
                },
            )
            if (response.data) {
                setRoomsForDeleted(response.data);

            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        roomsBin()
    }, [])

    useEffect(() => {
        roomsBin()
    }, [update])

    return (
        <div className="flex flex-col h-full mt-2 bg-slate-300 rounded-xl">
            <hr />
            <div className="flex flex-col h-full overflow-y-auto">
                {roomsForDeleted?.length > 0 ? (
                    roomsForDeleted?.map((element: { id: string, photo: string[], name: string, pax: number, destroyTime: string | null }) => (
                        (
                            <div>
                                <DashboardPapeleraRowRooms
                                    key={element.id}
                                    id={element.id}
                                    photo={element.photo}
                                    name={element.name}
                                    pax={element.pax}
                                />
                            </div>
                        ))
                    )) : (
                    <p>No hay Habitaciones</p>
                )}
            </div>
        </div>
    )
};

export default DashboardPapeleraRooms