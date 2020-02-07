import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    const { recipientId } = req.params;
    const { name } = req.body;
    const recipient = await Recipient.findByPk(recipientId);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    if (recipient) {
      const recipientExists = await Recipient.findOne({ where: { name } });

      if (recipientExists) {
        return res
          .status(400)
          .json({ error: 'Recipient email already exists.' });
      }
    }
    const recipientUpdated = await recipient.update(req.body);

    return res.json(recipientUpdated);
  }
}

export default new RecipientController();
