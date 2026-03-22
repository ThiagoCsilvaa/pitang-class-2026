import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware' // Adicione isso

interface CartItem {
  id: number
  title: string
  price: number
  quantity: number
  thumbnail: string
}

interface CartStore {
  cart: CartItem[]
  addToCart: (product: any) => void
  removeItem: (id: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      totalItems: 0,
      totalPrice: 0,
      
      addToCart: (product) => {
        const cart = get().cart
        const existingItem = cart.find((item) => item.id === product.id)

        if (existingItem) {
          const updatedCart = cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
          set({ 
            cart: updatedCart,
            totalItems: get().totalItems + 1,
            totalPrice: get().totalPrice + product.price
          })
        } else {
          set({ 
            cart: [...cart, { ...product, quantity: 1 }],
            totalItems: get().totalItems + 1,
            totalPrice: get().totalPrice + product.price
          })
        }
      },

      removeItem: (id) => {
        const itemToRemove = get().cart.find(item => item.id === id)
        if (!itemToRemove) return

        set({
          cart: get().cart.filter((item) => item.id !== id),
          totalItems: get().totalItems - itemToRemove.quantity,
          totalPrice: get().totalPrice - (itemToRemove.price * itemToRemove.quantity)
        })
      },

      clearCart: () => set({ cart: [], totalItems: 0, totalPrice: 0 }),
    }),
    {
      name: 'shopping-cart-storage', 
      storage: createJSONStorage(() => localStorage),
    }
  )
)