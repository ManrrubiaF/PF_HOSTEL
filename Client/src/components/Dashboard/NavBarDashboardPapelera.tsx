const NavBarDashboardPapelera = () => {

    return (
        <div className="grid grid-cols-7 gap-4 bg-slate-900 p-4 rounded-lg shadow-lg mt-4 mr-4 ms-4">
            <div className="col-span-2">

            </div>
            <div className="col-span-1 flex items-center">
                <h6 className="text-lg font-medium text-white">Nombre</h6>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <h6 className="text-lg font-medium text-white">País</h6>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <h6 className="text-lg font-medium text-white">Ciudad</h6>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <h6 className="text-lg font-medium text-white">Restaurar</h6>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <h6 className="text-lg font-medium text-white">Eliminar</h6>
            </div>
        </div>
    );
};
export default NavBarDashboardPapelera