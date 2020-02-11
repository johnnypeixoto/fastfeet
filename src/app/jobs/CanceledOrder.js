import Mail from '../../lib/Mail';

class CanceledOrder {
  get key() {
    return 'CanceledOrder';
  }

  async handle({ data }) {
    const { deliveryCanceled } = data;

    await Mail.sendMail({
      to: `${deliveryCanceled.deliveryman.name} <${deliveryCanceled.deliveryman.email}>`,
      subject: 'Pedido de entrega, CANCELADO',
      template: 'canceledDelivery',
      context: {
        deliveryman: deliveryCanceled.deliveryman.name,
        recipient: deliveryCanceled.recipient.name,
        productDelivery: deliveryCanceled.product,
      },
    });
  }
}

export default new CanceledOrder();
