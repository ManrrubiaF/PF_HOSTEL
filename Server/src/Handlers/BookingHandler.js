const Stripe = require('stripe');
const { Booking, Room, User, Auth } = require('../db');
const { Op } = require('sequelize');
const stripe = new Stripe('sk_test_51NVdmjB3jfe4i46dYiBgwgb9jcft9tZ8mmSQC2YJf4w5xVew4tCtdiZ1frDkUvpagyM0FskqPMISAe3oRPRoClRf00aif6TnEF');
const nodemailer = require('nodemailer');
const endpointSecret = "whsec_ed391f08ba83c4f8e82d04709ee19174dcbd2b36cdbaaadcbc3cc7817a778a45";
require('dotenv').config();

async function createBooking(req, res) {
  
  try {
    const { id } = userData
    const { roomsToReserve } = req.body;


    if (!roomsToReserve || !Array.isArray(roomsToReserve) || roomsToReserve.length === 0) {
      return res.status(400).json({ error: "No rooms to reserve provided" });
    }

    const bookings = [];

    const rooms = await Promise.all(
      roomsToReserve.map(async (room) => {
        const roomDetails = await Room.findByPk(room.roomId);
        return {
          ...room,
          name: roomDetails.name,
          price: roomDetails.price,
        };
      })
    );


    const isRoomAlreadyReserved = async (roomId, checkin, checkout) => {
      const existingBooking = await Booking.findOne({
        where: {
          roomId,
          checkin: {
            [Op.lt]: checkout,
          },
          checkout: {
            [Op.gt]: checkin,
          },
        },
      });

      return existingBooking !== null;
    };

    const calculateDays = (item) => {

      const checkinDate = new Date(item.checkin);
      const checkoutDate = new Date(item.checkout);

      const differenceInMs = checkoutDate.getTime() - checkinDate.getTime();
      const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

      return differenceInDays;
    };

    const user = await User.findByPk(id);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: rooms.map((room) => ({
        price_data: {
          currency: 'usd',
          unit_amount: room.price * calculateDays(room) * 100,
          product_data: {
            name: room.name,
          },
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: `http://localhost:5173/`,
      cancel_url: `http://localhost:5173/`,
    });
    
    const name = user.name
    const sessionId = session.id;
    const urlpago = session.url;

    for (const room of rooms) {
      const { roomId, checkin, checkout } = room;

      const isReserved = await isRoomAlreadyReserved(roomId, checkin, checkout);
      if (!isReserved) {
        const booking = await Booking.create({
          roomId,
          userId: id,
          checkin,
          checkout,
          paymentStatus: "unpaid",
          sessionId: sessionId,
        });

        bookings.push(booking);

      } else {
        return res.status(400).json({ error: `Room with ID ${roomId} is already reserved for the selected dates` });
      }


    }
    
    await confirmationEmail(id, urlpago, name);

    res.status(200).json({ sessionId, urlpago, bookings })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const confirmationEmail = async (id, urlpago, name) => {
  try {
    const getUserEmail = async (id) => {
      const authUser = await Auth.findOne({
        where: { userId: id }
      });

      if (authUser) {
        return authUser.email;
      } else {
        throw new Error('Usuario no encontrado');
      }
    };

    const userEmail = await getUserEmail(id);
    const { PASSMAIL, COMPANYMAIL } = process.env;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: COMPANYMAIL,
        pass: PASSMAIL,
      }
    });
    

    await transporter.sendMail({
      from: `"Hotel Hunt"  <${COMPANYMAIL}>`, 
      to: userEmail, 
      subject: 'Confirmación de la reserva', 
      html: 
      `¡Gracias ${name} por reservar con nosotros!
      En tu perfil, de nuestra página, puedes ver los detalles de la/s reserva/s.
      En caso de no haber realizado el pago haga click en el siguente link: ${urlpago}
      Recuerda realizar el pago en las proximas 24 horas o la reserva será dada de baja.
      ¡Gracias por elegir HotelHunt!`, 
    });

  } catch (error) {
    console.log('Error en el servidor');
  }
};


const getReserves = async (req, res) => {
  const { id } = userData;

  try {
    const reserves = await Booking.findAll({
      where: {
        userId: id
      }
    })
    if (reserves) {
      return res.status(200).json(reserves);
    } else {
      return res.status(404).send('No se encontraron reservas')
    }

  } catch (error) {
    return res.status(500).json(error)
  }
}



const stripehook = async (req, res) => {
  /*const sig = req.headers['stripe-signature'];
  const payload = req.body;

  console.log(payload)
  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    console.log('Event:', event);
    console.log('Event type:', event.type);
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);    
  }*/
  const sessionId = req.body.data.object.id;
  const status = req.body.data.object.payment_status;
  

  try {
    const updateBooking = await Booking.findAll({where: {
      sessionId: sessionId,
    }})

    for(const booking of updateBooking){
      await booking.update({paymentStatus: status})
    }

    res.status(200).send('booking updated')
    
  } catch (error) {
    res.status(500).json(error);
  }
    
};

module.exports = {
  createBooking,
  confirmationEmail,
  getReserves,
  stripehook
};