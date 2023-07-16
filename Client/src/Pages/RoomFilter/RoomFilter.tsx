import { Star, User, Users, UsersFour, UsersThree } from "@phosphor-icons/react";
import { roomsSearchStore, roomsStore } from "../../Store";
import NavbarDetail from "../../components/NavBarDetail/NavBarDetail";
import RoomCard from "../../components/RoomCard/RoomCard";
import { useFetchRooms } from "../../hooks";
import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Button, Dropdown } from "@rewind-ui/core";
import { filterResetToast } from "../../components/toast";

const RoomFilter = () => {
  const navigate = useNavigate();
  useFetchRooms();
  const allRooms = roomsStore((state) => state.rooms);
  const roomsFiltered = roomsSearchStore((state) => state.roomsFilter)
  const { fetchFilterRooms, sortByPrice, reset } = roomsSearchStore()
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: ""
  });
  const [checkboxValuesCategory, setCheckboxValues] = useState({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
    checkbox5: false
  });
  const [checkboxValuesCapacity, setCheckboxCapacity] = useState({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
    checkbox5: false
  });

  const handleMinPriceChange = (e) => {
    setFilters({ ...filters, minPrice: e.target.value });
  };

  const handleMaxPriceChange = (e) => {
    setFilters({ ...filters, maxPrice: e.target.value });
  };

  useEffect(() => {
    applyFilters();
  }, [filters]); // Ejecuta applyFilters cuando filters cambie

  const applyFilters = () => {
    // Lógica para aplicar los filtros
    if (Number(filters.maxPrice) < Number(filters.minPrice)) {
      const maxAux = filters.minPrice;
      const minAux = filters.maxPrice;
      console.log("ctm ctm ctm");
      setFilters({
        minPrice: minAux,
        maxPrice: maxAux
      });
    }

    fetchFilterRooms(allRooms, filters, checkboxValuesCategory, checkboxValuesCapacity)
   

  };

  const handleSortBy = async (event) => {
    const sortByValue = event.target.value;
    roomsFiltered.length ? sortByPrice(roomsFiltered, sortByValue) : sortByPrice(allRooms, sortByValue)
    


  };

  const handleReset = () => {
    filterResetToast("Filtros reseteados")
    reset()
  }

  return (
    <div className="flex-col">
      {/* Navbar */}
      <NavbarDetail />


      {/* Espacio para los filtros y la lista de habitaciones */}
      <div className="flex">
        {/* Filtros */}
        <div className="bg-amber-500 w-[30%] p-10 border-8 border-zinc-950">
          <div className="flex">
            <div className="mx-2 ">
              <label htmlFor="minPrice">Precio mínimo:</label>
              <input
                type="number"
                id="minPrice"
                value={filters.minPrice}
                onChange={handleMinPriceChange}
                className="my-3"
              />
              <section className="range-slider container">
                <span className="full-range"></span>
                <span className="incl-range"></span>
                <input
                  name="rangeOne"
                  value={filters.minPrice}
                  min="62"
                  max="1000"
                  step="10"
                  type="range"
                  onChange={handleMinPriceChange}
                  className="w-[100%]"
                />
              </section>
            </div>
            <div className="flex-col">
              <label htmlFor="maxPrice">Precio máximo:</label>
              <input
                type="number"
                id="maxPrice"
                value={filters.maxPrice}
                onChange={handleMaxPriceChange}
                className="my-3"
              />
              <section className="range-slider container">
                <span className="full-range"></span>
                <span className="incl-range"></span>
                <input
                  name="rangeTwo"
                  value={filters.maxPrice}
                  min="62"
                  max="1000"
                  step="10"
                  type="range"
                  onChange={handleMaxPriceChange}
                  className="w-[100%]"
                />
              </section>
            </div>
          </div>



          {/* Div de categoría */}
          <div>
            <h3>Categoría</h3>
            {/* Componente de checkboxes */}
            <div className="flex">
              <input
                type="checkbox"
                id="checkbox5"
                checked={checkboxValuesCategory.checkbox5}
                onChange={() =>
                  setCheckboxValues({
                    ...checkboxValuesCategory,
                    checkbox5: !checkboxValuesCategory.checkbox5
                  })
                }
              />
              <label htmlFor="checkbox1" className="flex">5 stars {<Star size={26} color="gold" weight="fill" />}{<Star size={26} color="gold" weight="fill" />}{<Star size={26} color="gold" weight="fill" />}{<Star size={26} color="gold" weight="fill" />}{<Star size={26} color="gold" weight="fill" />}</label>
            </div>
            <div className="flex">
              <input
                type="checkbox"
                id="checkbox4"
                checked={checkboxValuesCategory.checkbox4}
                onChange={() =>
                  setCheckboxValues({
                    ...checkboxValuesCategory,
                    checkbox4: !checkboxValuesCategory.checkbox4
                  })
                }
              />
              <label htmlFor="checkbox1" className="flex">4 stars {<Star size={26} color="gold" weight="fill" />}{<Star size={26} color="gold" weight="fill" />}{<Star size={26} color="gold" weight="fill" />}{<Star size={26} color="gold" weight="fill" />}</label>
            </div>
            <div className="flex">
              <input
                type="checkbox"
                id="checkbox3"
                checked={checkboxValuesCategory.checkbox3}
                onChange={() =>
                  setCheckboxValues({
                    ...checkboxValuesCategory,
                    checkbox3: !checkboxValuesCategory.checkbox3
                  })
                }
              />
              <label htmlFor="checkbox1" className="flex">3 stars {<Star size={26} color="gold" weight="fill" />}{<Star size={26} color="gold" weight="fill" />}{<Star size={26} color="gold" weight="fill" />}</label>
            </div>
            <div className="flex">
              <input
                type="checkbox"
                id="checkbox2"
                checked={checkboxValuesCategory.checkbox2}
                onChange={() =>
                  setCheckboxValues({
                    ...checkboxValuesCategory,
                    checkbox2: !checkboxValuesCategory.checkbox2
                  })
                }
              />
              <label htmlFor="checkbox1" className="flex">2 stars {<Star size={26} color="gold" weight="fill" />}{<Star size={26} color="gold" weight="fill" />}</label>
            </div>
            <div className="flex">
              <input
                type="checkbox"
                id="checkbox1"
                checked={checkboxValuesCategory.checkbox1}
                onChange={() =>
                  setCheckboxValues({
                    ...checkboxValuesCategory,
                    checkbox1: !checkboxValuesCategory.checkbox1
                  })
                }
              />
              <label htmlFor="checkbox1" className="flex">1 stars {<Star size={26} color="gold" weight="fill" />}</label>
            </div>
          </div>

          <div>
            <h3>Capacity</h3>
            {/* Componente de checkboxes */}
            <div className="flex">
              <input
                type="checkbox"
                id="checkbox5"
                checked={checkboxValuesCapacity.checkbox5}
                onChange={() =>
                  setCheckboxCapacity({
                    ...checkboxValuesCapacity,
                    checkbox5: !checkboxValuesCapacity.checkbox5
                  })
                }
              />
              <label htmlFor="checkbox1" className="flex">5 people {<UsersFour size={26} color="black" weight="fill" />}{<User size={26} color="black" weight="fill" />}</label>
            </div>
            <div className="flex">
              <input
                type="checkbox"
                id="checkbox4"
                checked={checkboxValuesCapacity.checkbox4}
                onChange={() =>
                  setCheckboxCapacity({
                    ...checkboxValuesCapacity,
                    checkbox4: !checkboxValuesCapacity.checkbox4
                  })
                }
              />
              <label htmlFor="checkbox1" className="flex">4 people {<UsersFour size={26} color="black" weight="fill" />}</label>
            </div>
            <div className="flex">
              <input
                type="checkbox"
                id="checkbox3"
                checked={checkboxValuesCapacity.checkbox3}
                onChange={() =>
                  setCheckboxCapacity({
                    ...checkboxValuesCapacity,
                    checkbox3: !checkboxValuesCapacity.checkbox3
                  })
                }
              />
              <label htmlFor="checkbox1" className="flex">3 people {<UsersThree size={26} color="black" weight="fill" />}</label>
            </div>
            <div className="flex">
              <input
                type="checkbox"
                id="checkbox2"
                checked={checkboxValuesCapacity.checkbox2}
                onChange={() =>
                  setCheckboxCapacity({
                    ...checkboxValuesCapacity,
                    checkbox2: !checkboxValuesCapacity.checkbox2
                  })
                }
              />
              <label htmlFor="checkbox1" className="flex">2 people {<Users size={26} color="black" weight="fill" />}</label>
            </div>
            <div className="flex">
              <input
                type="checkbox"
                id="checkbox1"
                checked={checkboxValuesCapacity.checkbox1}
                onChange={() =>
                  setCheckboxCapacity({
                    ...checkboxValuesCapacity,
                    checkbox1: !checkboxValuesCapacity.checkbox1
                  })
                }
              />
              <label htmlFor="checkbox1" className="flex">1 person {<User size={26} color="black" weight="fill" />}</label>
            </div>
          </div>

          <button onClick={applyFilters}>Aplicar filtros</button>
          <button onClick={handleReset}>Reset filtros</button>
        </div>

        {/* Lista de habitaciones */}
        <div className="flex-col">
          <div className="flex justify-center">
            <select
              id="sort-by"
              className="bg-emerald-300"
              onChange={handleSortBy}
            >
              <option value="">Ordenar por</option>
              <option value="price-asc">Price (ascendente)</option>
              <option value="price-desc">Price (descendente)</option>
              <option value="capacity-asc">Capacity (ascendente)</option>
              <option value="capacity-desc">Capacity (descendente)</option>
            </select>
          </div>
          {
            roomsFiltered.length ?
              <div className="grid grid-cols-3 justify-center mb-4 gap-5">
                {roomsFiltered.map((room) => (
                  <Link to={`/roompage/${room.id}`} key={room.id}>
                    <RoomCard
                      id={room.id}
                      key={room.id}
                      name={room.name}
                      description={room.description}
                      price={room.price}
                      pax={room.pax}
                      services={room.services}
                      photo={room.photo}
                      floorNumber={room.floorNumber}
                      disabled={room.disabled}
                      hotelCategory={room.hotelCategory}
                    />
                  </Link>
                ))}
              </div>
              :
              <div className="grid grid-cols-3 justify-center mb-4 gap-5">
                {allRooms.map((room) => (
                  <Link to={`/roompage/${room.id}`} key={room.id}>
                    <RoomCard
                      id={room.id}
                      name={room.name}
                      description={room.description}
                      price={room.price}
                      pax={room.pax}
                      services={room.services}
                      photo={room.photo}
                      floorNumber={room.floorNumber}
                      disabled={room.disabled}
                      hotelCategory={room.hotelCategory}
                    />
                  </Link>
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  );
};

export default RoomFilter;
