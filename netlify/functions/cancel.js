import axios from 'axios';

export default async (req) => {
  const { paymentId } = await req.json();
  
  await axios.post(
    `https://api.minepi.com/v2/payments/${paymentId}/cancel`,
    {},
    { headers: { 'Authorization': `Key ${process.env.PI_API_KEY}` } }
  );
  
  return new Response('Payment cancelled');
};
