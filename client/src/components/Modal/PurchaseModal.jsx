import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import useAuth from '../../hooks/useAuth'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../Form/CheckoutForm';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK_KEY);

const PurchaseModal = ({ closeModal, isOpen, plant }) => {
  const { user } = useAuth();
  const { name, description, category, quantity, price, _id, seller, image } =
    plant || {}

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(price);
  const [orderData, setOrderData] = useState({
    customer: {
      name: user?.displayName,
      email: user?.email,
      image: user?.photoURL,
    },
    seller,
    plantId: _id,
    quantity: 1,
    price: price,
    plantName: name,
    plantCategory: category,
    plantImage: image
  });

  useEffect(() => {
    if (user)
      setOrderData(prev => {
        return {
          ...prev,
          customer: {
            name: user?.displayName,
            email: user?.email,
            image: user?.photoURL,
          },
        }
      })
  }, [user])

  const handleQuantity = value => {
    const totalQuantity = parseInt(value);
    if (totalQuantity > quantity) return toast.error('you cannnot purchase more')

    const calculatedPrice = totalQuantity * price

    setSelectedQuantity(totalQuantity)
    setTotalPrice(calculatedPrice)

    // 1.system one
    // setOrderData({
    //   ...orderData,
    //   price: calculatedPrice,
    //   quantity: selectedQuantity
    // })


    // 1.system two(react recomended)
    setOrderData(prev => {
      return {
        ...prev,
        price: calculatedPrice,
        quantity: totalQuantity
      }
    })
  }





  return (
    <Dialog
      open={isOpen}
      as='div'
      className='relative z-10 focus:outline-none '
      onClose={closeModal}
    >
      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-center justify-center p-4'>
          <DialogPanel
            transition
            className='w-full max-w-md bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-xl rounded-2xl'
          >
            <DialogTitle
              as='h3'
              className='text-lg font-medium text-center leading-6 text-gray-900'
            >
              Review Info Before Purchase
            </DialogTitle>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Plant: {name}</p>
            </div>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Category: {category}</p>
            </div>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Customer: {user?.displayName}</p>
            </div>

            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Price Per Unit: $ {price}</p>
            </div>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Available Quantity:{quantity}</p>
            </div>
            <hr className='mt-2' />
            <p>Order Info:</p>
            <div className='mt-2'>
              <input
                value={selectedQuantity}
                onChange={e => handleQuantity(e.target.value)}
                type='number'
                min={1}
                // max={quantity}
                className='border px-3 py-1' />
            </div>

            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Selected Quantity: {selectedQuantity}</p>
            </div>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Total Price: {totalPrice}</p>
            </div>
            {/* stripe checkout from */}
            <Elements stripe={stripePromise}>
              <CheckoutForm totalPrice={totalPrice} closeModal={closeModal} orderData={orderData} />
            </Elements>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default PurchaseModal
