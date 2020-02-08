import Mail from '../../lib/Mail';

class ConfirmedOrder {
  get key() {
    return 'ConfirmedOrder';
  }

  async handle({ data }) {
    const { deliveryStored, product } = data;

    console.log('is running!!!');

    await Mail.sendMail({
      to: `${deliveryStored.deliveryman.name} <${deliveryStored.deliveryman.email}>`,
      subject: 'Pedido de entrega',
      template: 'delivery',
      context: {
        deliveryman: deliveryStored.deliveryman.name,
        recipient: deliveryStored.recipient.name,
        productDelivery: product,
      },
    });
  }
}

export default new ConfirmedOrder();
