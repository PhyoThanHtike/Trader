// src/config/sidebar-config.ts
import {
  Home,
  User,
  ShoppingBasket,
  HandCoins,
  Settings,
  HelpCircle,
  LogOut,
  ClipboardClock,
  LayoutTemplate,
} from "lucide-react"

export const mainNav = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Profile", href: "/profile", icon: User },
  { title: "Buy / Sell ", href: "/order", icon: HandCoins },
  { title: "Products", href: "/products", icon: LayoutTemplate },
  { title: "History", href: "/history", icon: ClipboardClock },
]

export const bottomNav = [
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Help & Support", href: "/help", icon: HelpCircle },
  // { title: "Logout", href: "/logout", icon: LogOut, destructive: true },
]
