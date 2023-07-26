import { Text } from "@rewind-ui/core";
import axios from "axios";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { tokenStore, DashStore } from "../../Store";
import { userDeleteToast, successToast, errorToast } from "../toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const url = import.meta.env.VITE_URL;

export default function DashboardPapeleraRow({
    id,
    name,
    country,
    city,
    photo,
}: {
    id: string;
    name: string;
    country: string;
    city: string;
    photo: string;
}) {
    const navigate = useNavigate()
    const userData = tokenStore((state) => state.userState);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showConfirmRestore, setConfirmRestore] = useState(false);
    const { setUpdated } = DashStore();
    const currentState = DashStore((state) => state.updated)

    const handleDelete = () => {
        setShowConfirmDialog(true);
    };

    const confirmPermanentDelete = async (id: any) => {
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

            setUpdated(!currentState);

            setShowConfirmDialog(false);
        } catch (error) {
            console.log(error);
        }
    };
    

    const handleRestore = () => {
        setConfirmRestore(true)
    }

    const confirmRestore = async (id: any) => {
        try {
            const response = await axios.put(
                `${url}/dashboard/hotel/restore/${id}`,
                {},
                {
                    headers: {
                        authorization: `Bearer ${userData[1]}`,
                    },
                }
            )
            console.log(response);
            console.log("Hotel Restaurado");

            successToast('Hotel Restaurado');

            setShowConfirmDialog(false)

            setUpdated(!currentState)

        } catch (error) {
            console.log(error);

        }
    };

    return (
        <div className="dashboard-row bg-white rounded-md p-4 mb-4">
            <div className="grid grid-cols-7 gap-4">
                <div className="col-span-2">
                    <img src={photo[0]} alt={name} className="w-48 h-48 object-cover" onClick={() => navigate(`/dashboard/hoteldetail/${id}`)} />
                </div>
                <div className="col-span-1 flex flex-col justify-center">
                    <Text variant="h6" className="text-lg font-medium">
                        {name}
                    </Text>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                    <Text variant="h6" className="text-lg font-medium">
                        {country}
                    </Text>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                    <Text variant="h6" className="text-lg font-medium">
                        {city}
                    </Text>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                    <button onClick={(e) => {
                        e.stopPropagation();
                        handleRestore();
                    }}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-md transition-all ease-in-out duration-200 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        Restaurar
                    </button>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                    <button onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                    }}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md shadow-md transition-all ease-in-out duration-200 focus:outline-none focus:ring focus:ring-red-300"
                    >
                        Eliminar
                    </button>
                </div>
            </div>

            {showConfirmDialog && (
                <div className="bg-slate-600 fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                    <div className="confirm-dialog-overlay" onClick={() => setShowConfirmDialog(false)} />
                    <div className="confirm-dialog-content bg-white rounded-lg p-6 shadow-lg">
                        <h3 className="confirm-dialog-title text-2xl font-semibold mb-4 text-gray-900">Confirmar Eliminación</h3>
                        <p className="confirm-dialog-message text-gray-800">¿Estás seguro de que deseas eliminar para siempre este hotel?</p>
                        <div className="confirm-dialog-buttons mt-6 flex justify-end">
                            <button className="border-slate-950 text-white bg-lime-500 w-[100px] py-2 px-4 rounded-md mr-4" onClick={(e) => { e.stopPropagation(); confirmPermanentDelete(id); }}>
                                Sí
                            </button>
                            <button className="border-slate-950 text-white bg-red-500 w-[100px] py-2 px-4 rounded-md" onClick={(e) => { setShowConfirmDialog(false); e.stopPropagation(); }}>
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showConfirmRestore && (
                <div className="bg-slate-600 fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                    <div className="confirm-dialog-overlay" onClick={() => setShowConfirmDialog(false)} />
                    <div className="confirm-dialog-content bg-white rounded-lg p-6 shadow-lg">
                        <h3 className="confirm-dialog-title text-2xl font-semibold mb-4 text-gray-900">Confirmar Restauración</h3>
                        <p className="confirm-dialog-message text-gray-800">¿Estás seguro de que deseas restaurar este hotel?</p>
                        <div className="confirm-dialog-buttons mt-6 flex justify-end">
                            <button className="border-slate-950 text-white bg-lime-500 w-[100px] py-2 px-4 rounded-md mr-4" onClick={(e) => { e.stopPropagation(); confirmRestore(id); }}>
                                Sí
                            </button>
                            <button className="border-slate-950 text-white bg-red-500 w-[100px] py-2 px-4 rounded-md" onClick={(e) => { setConfirmRestore(false); e.stopPropagation(); }}>
                                No
                            </button>
                        </div>
                    </div>
                </div>


            )}
        </div>
    );
}