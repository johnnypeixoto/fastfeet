import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
  isBefore,
} from 'date-fns';
import { Op } from 'sequelize';
import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Signature from '../models/Signature';

class DeliveryOrderController {
  async store(req, res) {
    const { deliveryId, deliverymanId } = req.params;
    const { date } = req.query;

    if (!date) return res.status(400).json({ error: 'Invalid date' });

    const deliveryman = await Deliveryman.findByPk(deliverymanId);

    if (!deliveryman)
      return res.status(404).json({ error: 'Deliveryman not found' });

    const delivery = await Delivery.findOne({
      where: { id: deliveryId, deliveryman_id: deliverymanId },
    });

    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    if (delivery.start_date) {
      return res.status(400).json({ error: 'This delivery already in course' });
    }

    const searchDate = Number(date);

    const timeToDelivery = ['08:00', '18:00'];

    const available = timeToDelivery.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          time === timeToDelivery[1]
            ? isAfter(value, new Date())
            : isBefore(value, new Date()),
      };
    });

    if (!(available[0].available && available[1].available))
      return res.status(400).json({ error: 'Time unavailable for delivery' });

    const { count } = await Delivery.findAndCountAll({
      where: {
        deliveryman_id: deliverymanId,
        start_date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    if (count > 5)
      return res.status(400).json({
        error:
          'Number of delivery exceeded, you can make only five delivery per day',
      });

    delivery.start_date = new Date();
    delivery.save();
    return res.json(available);
  }

  async update(req, res) {
    const { deliveryId, deliverymanId } = req.params;

    const schema = Yup.object().shape({
      originalname: Yup.string().required(),
      filename: Yup.string().required(),
    });

    if (!(await schema.isValid(req.file)))
      return res.status(401).json({ error: 'Validations fails' });

    const deliveryman = await Deliveryman.findByPk(deliverymanId);

    if (!deliveryman)
      return res.status(404).json({ error: 'Deliveryman not found' });

    const delivery = await Delivery.findOne({
      where: {
        id: deliveryId,
        deliveryman_id: deliverymanId,
        canceled_at: null,
      },
    });

    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    if (!delivery.start_date)
      return res.status(404).json({
        error: 'You cannot finish this delivery without starting it before',
      });

    const { originalname: name, filename: path } = req.file;

    const { id } = await Signature.create({
      name,
      path,
    });

    delivery.end_date = new Date();
    delivery.signature_id = id;
    delivery.save();

    return res.json(delivery);
  }
}

export default new DeliveryOrderController();
