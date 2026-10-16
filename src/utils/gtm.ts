import { Product, Order } from '../types/index.js';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

let loadedGTMId: string | null = null;

export function initGTM(containerId?: string): void {
  if (!containerId || typeof window === 'undefined') return;

  const trimmedId = containerId.trim().toUpperCase();
  // Don't initialize if placeholder or invalid format
  if (!trimmedId || trimmedId === 'GTM-XXXXXXX' || !trimmedId.startsWith('GTM-')) {
    return;
  }

  if (loadedGTMId === trimmedId) {
    return; // Already initialized
  }

  loadedGTMId = trimmedId;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });

  // Inject script tag
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${trimmedId}`;
  document.head.appendChild(script);

  // Inject noscript iframe for non-JS
  const noscript = document.createElement('noscript');
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${trimmedId}`;
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  noscript.appendChild(iframe);
  document.body.insertBefore(noscript, document.body.firstChild);
}

// Track view_item event (GA4 standard)
export function trackViewItem(product: Product): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce object
  window.dataLayer.push({
    event: 'view_item',
    ecommerce: {
      currency: 'BDT',
      value: product.offerPrice,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.offerPrice,
          quantity: 1,
          item_category: 'Herbal Wellness',
        },
      ],
    },
  });
}

// Track begin_checkout event
export function trackBeginCheckout(product: Product, quantity: number, total: number): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: 'begin_checkout',
    ecommerce: {
      currency: 'BDT',
      value: total,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.offerPrice,
          quantity,
          item_category: 'Herbal Wellness',
        },
      ],
    },
  });
}

// Track purchase event with deduplication protection
export function trackPurchase(order: Order): void {
  if (typeof window === 'undefined') return;

  const dedupKey = `gtm_purchased_${order.orderNumber}`;
  if (sessionStorage.getItem(dedupKey)) {
    // Already fired for this order in this session, skip
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: 'purchase',
    ecommerce: {
      transaction_id: order.orderNumber,
      value: order.totalAmount,
      currency: 'BDT',
      shipping: order.deliveryFee,
      items: [
        {
          item_id: order.productId,
          item_name: order.productName,
          price: order.unitPrice,
          quantity: order.quantity,
          item_category: 'Herbal Wellness',
        },
      ],
    },
  });

  // Mark order as tracked
  try {
    sessionStorage.setItem(dedupKey, 'true');
  } catch {
    // ignore sessionStorage errors if storage full or private mode
  }
}
