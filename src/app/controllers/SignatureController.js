import Signature from '../models/Signature';

class SignatureController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await Signature.create({
      name,
      path,
    });

    return res.json(file);
  }

  async delete(req, res) {
    const { deliverymanId } = req.params;
    const deliveryman = await Signature.destroy({
      where: { id: deliverymanId },
    });

    return res.json(deliveryman);
  }
}

export default new SignatureController();
