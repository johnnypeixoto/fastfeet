import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const recipients = await Recipient.findAll({ order: ['id'] });
    return res.json(recipients);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      town: Yup.string().required(),
      cep: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(401).json({ error: 'Validations fails' });

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    const { recipientId } = req.params;
    const recipient = await Recipient.findByPk(recipientId);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    const recipientUpdated = await recipient.update(req.body);

    return res.json(recipientUpdated);
  }

  async delete(req, res) {
    const { recipientId } = req.params;
    const recipientExists = await Recipient.findByPk(recipientId);

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient not found' });
    }
    const recipient = await Recipient.destroy({
      where: { id: recipientId },
    });

    if (recipient) {
      return res.status(200).json({ deleted: 'successfully' });
    }

    return res.status(404).json({ delete: 'unsuccessfully' });
  }
}

export default new RecipientController();
