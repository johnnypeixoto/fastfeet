import DeliveryProblem from '../models/DeliveryProblem';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import CanceledOrder from '../jobs/CanceledOrder';
import Queue from '../../lib/Queue';

class DeliveryProblemController {
  async index(req, res) {
    const problems = await DeliveryProblem.findAll({ order: ['id'] });
    return res.json(problems);
  }

  async show(req, res) {
    const { deliveryId } = req.params;

    const problems = await DeliveryProblem.findAll({
      where: { delivery_id: deliveryId },
      include: [{ model: Delivery, as: 'delivery', attributes: ['product'] }],
      order: ['id'],
    });

    return res.json(problems);
  }

  async delete(req, res) {
    const { problemId } = req.params;
    const { date } = req.query;

    const { delivery_id } = await DeliveryProblem.findByPk(problemId);

    const deliveryCanceled = await Delivery.findByPk(delivery_id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name'],
        },
      ],
    });

    if (!deliveryCanceled)
      return res.status(400).json({ error: 'Delivery not found' });

    if (deliveryCanceled.canceled_at)
      return res
        .status(400)
        .json({ error: 'Delivery has already been canceled' });

    deliveryCanceled.canceled_at = new Date();
    deliveryCanceled.save();

    await Queue.add(CanceledOrder.key, {
      deliveryCanceled,
      date,
    });

    return res.json(deliveryCanceled);
  }
}

export default new DeliveryProblemController();
