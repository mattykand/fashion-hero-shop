"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "./announcement-bar";
import { Header } from "./header";
import { Footer } from "./footer";
import { CartProvider, useCart } from "./cart-provider";
import { WishlistProvider, useWishlist } from "./wishlist-provider";
import { QuickViewProvider } from "./quick-view-provider";
import { AuthProvider } from "./auth-provider";
import { SellerAnalyticsPromoModal } from "./seller-analytics-promo-modal";

// Standalone pages that ship their own header and shouldn't carry the
// shop's nav/announcement bar/footer — they aren't shopping surfaces.
const BARE_ROUTE_PREFIXES = ["/seller/analytics"];

function ShellInner({ children }: { children: React.ReactNode }) {
  const { openCart, itemCount } = useCart();
  const { wishlistItems } = useWishlist();
  const pathname = usePathname();
  const isBareRoute = BARE_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isBareRoute) {
    return (
      <>
        {children}
        <SellerAnalyticsPromoModal />
      </>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Header onCartOpen={openCart} cartCount={itemCount} wishlistCount={wishlistItems.length} />
      <main className="flex-1">{children}</main>
      <Footer />
      <SellerAnalyticsPromoModal />
    </>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <QuickViewProvider>
            <ShellInner>{children}</ShellInner>
          </QuickViewProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
