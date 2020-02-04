import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class DeliveryController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'street', 'number', 'cep'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validations fails' });

    const { recipient_id, deliveryman_id, product } = req.body;

    const recipentExists = await Recipient.findByPk(recipient_id);
    if (!recipentExists) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);
    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const { id } = await Delivery.create({
      deliveryman_id,
      recipient_id,
      product,
    });

    const deliveryStored = await Delivery.findByPk(id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(deliveryStored);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validations fails' });

    const { deliveryId } = req.params;

    const { recipient_id, deliveryman_id } = req.body;

    const recipentExists = await Recipient.findByPk(recipient_id);
    if (!recipentExists) {
      return res.status(400).json({
        error: 'Recipient does not yet exist, please choose a valid Recipient',
      });
    }

    const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);
    if (!deliverymanExists) {
      return res.status(400).json({
        error:
          'Deliveryman does not yet exist, please choose a valid Deliveryman',
      });
    }

    const deliveryUpdated = await Delivery.findByPk(deliveryId);

    deliveryUpdated.update(req.body);

    return res.json(deliveryUpdated);
  }

  async delete(req, res) {
    const { deliveryId } = req.params;

    const deliveryExists = await Delivery.findByPk(deliveryId);

    if (!deliveryExists) {
      return res.status(400).json({
        error: 'Delivery does not found, please choose a valid Delivery',
      });
    }

    const delivery = await Delivery.destroy({
      where: {
        id: deliveryId,
      },
    });

    if (delivery) return res.status(200).json({ deleted: 'successfully' });

    return res.status(404).json({ delete: 'unsuccessfully' });
  }
}

export default new DeliveryController();
