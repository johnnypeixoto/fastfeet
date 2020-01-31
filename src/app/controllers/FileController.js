import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }

  async delete(req, res) {
    const { deliverymanId } = req.params;
    const deliveryman = await File.destroy({
      where: { id: deliverymanId },
    });

    return res.json(deliveryman);
  }
}

export default new FileController();
