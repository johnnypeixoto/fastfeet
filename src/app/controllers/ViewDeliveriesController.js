import { isAfter } from 'date-fns';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class ViewDeliveriesController {
  async index(req, res) {
    const { deliverymanId } = req.params;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: deliverymanId,
        signature_id: null,
        end_date: null,
        canceled_at: null,
      },
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'street',
            'number',
            'complement',
            'state',
            'town',
            'cep',
          ],
        },
      ],
      order: ['id'],
    });

    return res.json(deliveries);
  }
}

export default new ViewDeliveriesController();
