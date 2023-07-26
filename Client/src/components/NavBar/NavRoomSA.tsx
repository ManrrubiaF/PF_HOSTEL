import { Text } from "@rewind-ui/core";


const NavSADBRoom = () => {

    return (
        <div className="grid grid-cols-8 gap-4 bg-white">
            <div className="col-span-1 flex items-center justify-center">
                <Text variant="h6" className="text-lg font-medium">
                    Foto de  la Habitación
                </Text>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <Text variant="h6" className="text-lg font-medium">
                    Nombre de Habitación
                </Text>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <Text variant="h6" className="text-lg font-medium">
                    Nombre del Hotel
                </Text>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <Text variant="h6" className="text-lg font-medium">
                    Eliminar
                </Text>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <Text variant="h6" className="text-lg font-medium">
                    Desactivar
                </Text>
            </div>
        </div>
    );
};
export default NavSADBRoom